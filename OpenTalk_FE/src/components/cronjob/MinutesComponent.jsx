import React, { useState, useEffect } from 'react';
import Constants from '../common/Constant';
const MinuteScheduler = ({ minutes, setMinutes }) => {
  const [minuteType, setMinuteType] = useState(''); // Types: 'every', 'increment', 'specific', 'range'
  const [incrementStart, setIncrementStart] = useState('0');
  const [incrementStep, setIncrementStep] = useState('1');
  const [specificMinutes, setSpecificMinutes] = useState([]);
  const [rangeStart, setRangeStart] = useState('0');
  const [rangeEnd, setRangeEnd] = useState('0');

  useEffect(() => {
    if (!minutes) return;

    if (minutes.includes('*')) {
      setMinuteType(Constants.TYPE_CRONJOB.EVERY);
    } else if (minutes.includes('/')) {
      const increments = minutes.split('/');
      setIncrementStart(increments[0]);
      setIncrementStep(increments[1]);
      setMinuteType(Constants.TYPE_CRONJOB.INCREMENT);
    } else if (minutes.includes('-')) {
      const ranges = minutes.split('-');
      setRangeStart(ranges[0]);
      setRangeEnd(ranges[1]);
      setMinuteType(Constants.TYPE_CRONJOB.RANGE);
    } else {
      setSpecificMinutes(minutes.split(','));
      setMinuteType(Constants.TYPE_CRONJOB.SPECIFIC);
    }
  }, [minutes]);
  useEffect(() => {
    let result = '';
    if (minuteType === Constants.TYPE_CRONJOB.EVERY) {
      result = '*';
    } else if (minuteType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${incrementStart}/${incrementStep}`;
    } else if (minuteType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificMinutes.length > 0 ? specificMinutes.join(',') : '0';
    } else if (minuteType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`;
    } else {
      return;
    }
    setMinutes(result);
  }, [minuteType, incrementStart, incrementStep, specificMinutes, rangeStart, rangeEnd]);

  const handleSpecificChange = (minute) => {
    setSpecificMinutes((prev) => {
      const updatedMinutes = prev.includes(minute)
        ? prev.filter(m => m !== minute)
        : [...prev, minute];
      return updatedMinutes.sort((a, b) => a - b);
    });
  };
  return (
    <div className='custom-tab-pane' id='tabs-2' role='tabpanel'>
      <div>
        <div className='custom-form-check mb-3'>
          <input
            className='custom-form-check-input'
            type='radio'
            id='cronEveryMinute'
            name='cronMinute'
            checked={minuteType === 'every'}
            onChange={() => {
              setMinuteType('every');
            }}
          />
          <label className='custom-form-check-label' htmlFor='cronEveryMinute'>
            Every minute
          </label>
        </div>

        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronMinuteIncrement'
              name='cronMinute'
              checked={minuteType === 'increment'}
              onChange={() => {
                setMinuteType('increment');
              }}
          />
          <label className='lable-select lable-select-every' htmlFor='cronMinuteIncrement'>Every</label>
          <select
              id='cronMinuteIncrementIncrement'
              className='custom-select-form'
              value={incrementStep}
              onChange={(e) => {
                setIncrementStep(e.target.value);
              }}
          >
            {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
            ))}
          </select>
          <label className='lable-select lable-select-minute-increment' htmlFor='cronMinuteIncrement'>minute(s) starting at minute</label>
          <select
              id='cronMinuteIncrementStart'
              className='custom-select-form'
              value={incrementStart}
              onChange={(e) => {
                setIncrementStart(e.target.value);
              }}
          >
            {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
            ))}
          </select>
        </div>

        <div className='custom-form-check mb-3'>
          <input
              type='radio'
              className='custom-form-check-input'
            id='cronMinuteSpecific'
            name='cronMinute'
            checked={minuteType === 'specific'}
            onChange={() => {
              setMinuteType('specific');
            }}
          />
          <label className='custom-form-check-label' htmlFor='cronMinuteSpecific'>Specific minute (choose one or many)</label>
          <div
              className={`custom-checkbox-cronjob-wrapper ${
                  minuteType === 'specific' ? 'show' : ''
              }`}
          >
            <div className='custom-checkbox-cronjob'>
              {Array.from({ length: 60 }, (_, i) => (
                  <div key={i} className='custom-col-6p' style= {{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <input
                        className='custom-form-check-input'
                        name='cronMinuteSpecificSpecific'
                        type='checkbox'
                        id={`cronMinute${i}`}
                        value={i}
                        checked={specificMinutes.includes(i.toString())}
                        onChange={() => {
                          handleSpecificChange(i.toString());
                        }}
                    />
                    <label className='custom-form-check-label' htmlFor={`cronMinute${i}`}>
                      {i.toString().padStart(2, '0')}
                    </label>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronMinuteRange'
              name='cronMinute'
              checked={minuteType === 'range'}
              onChange={() => {
                setMinuteType('range');
              }}
          />
          <label className='lable-select lable-select-range-left' htmlFor='cronMinuteRange'>Every minute between minute</label>
          <select
              id='cronMinuteRangeStart'
              className='custom-select-form'
              value={rangeStart}
              onChange={(e) => {
                setRangeStart(e.target.value);
              }}
          >
            {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
            ))}
          </select>
          <label className='lable-select' htmlFor='cronMinuteRange'>and minute</label>
          <select
              id='cronMinuteRangeEnd'
              className='custom-select-form'
              value={rangeEnd}
              onChange={(e) => {
                setRangeEnd(e.target.value);
              }}
          >
            {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MinuteScheduler;

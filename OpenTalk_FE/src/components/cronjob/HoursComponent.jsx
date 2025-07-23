import React, { useState, useEffect } from 'react';
import Constants from '../common/Constant';
const HoursComponent = ({ hours, setHours }) => {
  const [hourType, setHourType] = useState('');
  const [incrementStart, setIncrementStart] = useState('0');
  const [incrementStep, setIncrementStep] = useState('1');
  const [specificHours, setSpecificHours] = useState([]);
  const [rangeStart, setRangeStart] = useState('0');
  const [rangeEnd, setRangeEnd] = useState('0');
  const [resultHour, setResultHour] = useState('*');

  useEffect(() => {
    let result = '';
    if (hourType === Constants.TYPE_CRONJOB.EVERY) {
      result = '*';
    } else if (hourType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${incrementStart}/${incrementStep}`;
    } else if (hourType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificHours.length > 0 ? specificHours.join(',') : '0';
    } else if (hourType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`;
    } else {
      return;
    }
    setHours(result);
  }, [hourType, incrementStart, incrementStep, specificHours, rangeStart, rangeEnd]);

  useEffect(() => {
    if (!hours) return;

    if (hours.includes('*')) {
      setHourType(Constants.TYPE_CRONJOB.EVERY);
    } else if (hours.includes('/')) {
      const increments = hours.split('/');
      setIncrementStart(increments[0]);
      setIncrementStep(increments[1]);
      setHourType(Constants.TYPE_CRONJOB.INCREMENT);
    } else if (hours.includes('-')) {
      const ranges = hours.split('-');
      setRangeStart(ranges[0]);
      setRangeEnd(ranges[1]);
      setHourType(Constants.TYPE_CRONJOB.RANGE);
    } else {
      setSpecificHours(hours.split(','));
      setHourType(Constants.TYPE_CRONJOB.SPECIFIC);
    }
  }, [hours]);

  const handleSpecificChange = (hour) => {
    setSpecificHours((prev) => {
      const updatedHours = prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour];
      return updatedHours.sort((a, b) => a - b);
    });
  };
  return (
    <div className='custom-tab-pane' id='tabs-2' role='tabpanel'>
      <div className='custom-form-check mb-3'>
        <input
          className='custom-form-check-input'
          type='radio'
          id='cronEveryHour'
          name='cronHour'
          checked={hourType === 'every'}
          onChange={() => setHourType('every')}
        />
        <label className='custom-form-check-label' htmlFor='cronEveryHour'>
          Every hour
        </label>
      </div>

      <div className='custom-form-check mb-3'>
        <input
            className='custom-form-check-input'
            type='radio'
            id='cronHourIncrement'
            name='cronHour'
            checked={hourType === 'increment'}
            onChange={() => setHourType('increment')}
        />
        <label className='lable-select lable-select-every' htmlFor='cronHourIncrement'>Every</label>
        <select
            id='cronHourIncrementStep'
            className='custom-select-form'
            value={incrementStep}
            onChange={e => setIncrementStep(e.target.value)}
        >
          {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
          ))}
        </select>
        <label className='lable-select lable-select-hour-increment' htmlFor='cronHourIncrement'>hour(s) starting at hour</label>
        <select
            id='cronHourIncrementStart'
            className='custom-select-form'
            value={incrementStart}
            onChange={e => setIncrementStart(e.target.value)}
        >
          {Array.from({ length: 24 }, (_, i) => (
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
            id='cronHourSpecific'
            name='cronHour'
            checked={hourType === 'specific'}
            onChange={() => setHourType('specific')}
        />
        <label className='custom-form-check-label' htmlFor='cronHourSpecific'>Specific hour (choose one or many)</label>
        <div
            className={`custom-checkbox-cronjob-wrapper ${
                hourType === 'specific' ? 'show' : ''
            }`}
        >
          <div className='custom-checkbox-cronjob'>
            {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className='custom-col-6p' style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input
                      className='custom-form-check-input'
                      name='cronHourSpecificSpecific'
                      type='checkbox'
                      id={`cronHour${i}`}
                      value={i}
                      checked={specificHours.includes(i.toString())}
                      onChange={() => handleSpecificChange(i.toString())}
                  />
                  <label className='custom-form-check-label' htmlFor={`cronHour${i}`}>
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
            id='cronHourRange'
            name='cronHour'
            checked={hourType === 'range'}
            onChange={() => setHourType('range')}
        />
        <label className='lable-select lable-select-hour-range-left' htmlFor='cronHourRange'>Every hour between
          hour</label>
        <select
            id='cronHourRangeStart'
            className='custom-select-form'
            value={rangeStart}
            onChange={e => setRangeStart(e.target.value)}
        >
          {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}
              </option>
          ))}
        </select>
        <label className='lable-select lable-select-hour-range-right' htmlFor='cronHourRange'>and hour</label>
        <select
            id='cronHourRangeEnd'
            className='custom-select-form'
            value={rangeEnd}
            onChange={e => setRangeEnd(e.target.value)}
        >
          {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}
              </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default HoursComponent;

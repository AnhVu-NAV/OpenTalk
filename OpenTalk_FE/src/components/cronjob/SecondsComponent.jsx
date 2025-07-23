import React, { useState, useEffect } from 'react';
import Constants from '../../../../../../constants/Constants';


const SecondsComponent = ({ seconds, setSeconds }) => {
  const [secondType, setSecondType] = useState(''); // Types: 'every', 'increment', 'specific', 'range'
  const [incrementStart, setIncrementStart] = useState('0');
  const [incrementStep, setIncrementStep] = useState('1');
  const [specificSeconds, setSpecificSeconds] = useState([]);
  const [rangeStart, setRangeStart] = useState('0');
  const [rangeEnd, setRangeEnd] = useState('0');

  useEffect(() => {
    if (!seconds) return;
    if (seconds.includes('*')) {
      setSecondType(Constants.TYPE_CRONJOB.EVERY);
    } else if (seconds.includes('/')) {
      const increments = seconds.split('/');
      setIncrementStart(increments[0]);
      setIncrementStep(increments[1]);
      setSecondType(Constants.TYPE_CRONJOB.INCREMENT);
    } else if (seconds.includes('-')) {
      const ranges = seconds.split('-');
      setRangeStart(ranges[0]);
      setRangeEnd(ranges[1]);
      setSecondType(Constants.TYPE_CRONJOB.RANGE);
    } else {
      setSpecificSeconds(seconds.split(','));
      setSecondType(Constants.TYPE_CRONJOB.SPECIFIC);
    }
  }, [seconds]);
  useEffect(() => {
    let result = '';
    if (secondType === Constants.TYPE_CRONJOB.EVERY) {
      result = '*';
    } else if (secondType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${incrementStart}/${incrementStep}`;
    } else if (secondType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificSeconds.length > 0 ? specificSeconds.join(',') : '0';
    } else if (secondType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`;
    } else {
      return;
    }
    setSeconds(result);
  }, [secondType, incrementStart, incrementStep, specificSeconds, rangeStart, rangeEnd]);

  const handleSpecificChange = (second) => {
    setSpecificSeconds((prev) => {
      const updatedSecondsSpecific = prev.includes(second)
        ? prev.filter(s => s !== second)
        : [...prev, second];
      return updatedSecondsSpecific.sort((a, b) => a - b);
    });
  };
  return (
    <div className='custom-tab-pane' id='tabs-2' role='tabpanel'>
      <div>
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronEverySecond'
              name='cronSecond'
              checked={secondType === 'every'}
              onChange={() => setSecondType('every')}
          />
          <label className='custom-form-check-label' htmlFor='cronEverySecond'>
            Every second
          </label>
        </div>

        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronSecondIncrement'
              name='cronSecond'
              checked={secondType === 'increment'}
              onChange={() => setSecondType('increment')}
          />
          <label className='lable-select lable-select-every' htmlFor='cronSecondIncrement'>Every</label>
          <select
              id='cronSecondIncrementIncrement'
              className='custom-select-form'
              value={incrementStep}
              onChange={e => setIncrementStep(e.target.value)}
          >
            {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
            ))}
          </select>
          <label className='lable-select lable-select-second-increment' htmlFor='cronSecondIncrement'> second(s) starting at second</label>
          <select
              id='cronSecondIncrementStart'
              className='custom-select-form'
              value={incrementStart}
              onChange={e => setIncrementStart(e.target.value)}
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
              id='cronSecondSpecific'
              name='cronSecond'
              checked={secondType === 'specific'}
              onChange={() => setSecondType('specific')}
          />
          <label className='custom-form-check-label' htmlFor='cronSecondSpecific'>
            Specific second (choose one or many)
          </label>
          <div
              className={`custom-checkbox-cronjob-wrapper ${
                  secondType === 'specific' ? 'show' : ''
              }`}
          >
            <div className='custom-checkbox-cronjob'>
              {Array.from({ length: 60 }, (_, i) => (
                  <div
                      key={i}
                      className='custom-col-6p'
                      style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <input
                        className='custom-form-check-input'
                        name='cronSecondSpecificSpecific'
                        type='checkbox'
                        id={`cronSecond${i}`}
                        value={i}
                        checked={specificSeconds.includes(i.toString())}
                        onChange={() => handleSpecificChange(i.toString())}
                    />
                    <label className='custom-form-check-label' htmlFor={`cronSecond${i}`}>
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
              id='cronSecondRange'
              name='cronSecond'
              checked={secondType === 'range'}
              onChange={() => setSecondType('range')}
          />
          <label className='lable-select lable-select-range-left' htmlFor='cronSecondRange'>
            Every second between second
          </label>
          <div className='custom-checkbox-cronjob'>
            <select
                id='cronSecondRangeStart'
                className='custom-select-form'
                value={rangeStart}
                onChange={e => setRangeStart(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, '0')}
                  </option>
              ))}
            </select>
          </div>
          <label className='lable-select lable-select-second-right' htmlFor='cronSecondRange'>
            and second
          </label>
          <div className='custom-checkbox-cronjob'>
            <select
                id='cronSecondRangeEnd'
                className='custom-select-form'
                value={rangeEnd}
                onChange={e => setRangeEnd(e.target.value)}
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
    </div>
  );
};

export default SecondsComponent;

import React, { useState, useEffect, use } from 'react';
import Constants from '../../../../../../constants/Constants';

const MonthComponent = ({ months, setMonths }) => {
  const [monthType, setMonthType] = useState(Constants.TYPE_CRONJOB.EVERY);
  const [increment, setIncrement] = useState(1);
  const [startMonth, setStartMonth] = useState(1);
  const [specificMonths, setSpecificMonths] = useState([]);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(12);

  const monthOrder = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];

  const monthsAll = Constants.MONTHS;

  const handleSpecificMonthsChange = (month) => {
    setSpecificMonths((prev) => {
      const updated = prev.includes(month)
        ? prev.filter(m => m !== month) // Remove if exists
        : [...prev, month]; // Add if not exists
      return updated.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)); // Sort by order
    });
  };

  useEffect(() => {
    let result = '';

    if (monthType === Constants.TYPE_CRONJOB.EVERY) {
      result = '*'; // Every month
    } else if (monthType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${startMonth}/${increment}`; // Increment format: start/step
    } else if (monthType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificMonths.length > 0 ? specificMonths.join(',') : 'JAN'; // Specific months
    } else if (monthType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`; // Range format: start-end
    } else {
      return;
    }

    setMonths(result); // Update the months in the parent component
  }, [monthType, increment, startMonth, specificMonths, rangeStart, rangeEnd, setMonths]);

  useEffect(() => {
    if (!months) return;

    if (months.includes('*')) {
      setMonthType(Constants.TYPE_CRONJOB.EVERY);
    } else if (months.includes('/')) {
      const increments = months.split('/');
      setIncrement(Number(increments[1]));
      setStartMonth(Number(increments[0]));
      setMonthType(Constants.TYPE_CRONJOB.INCREMENT);
    } else if (months.includes('-')) {
      const ranges = months.split('-');
      setRangeStart(Number(ranges[0]));
      setRangeEnd(Number(ranges[1]));
      setMonthType(Constants.TYPE_CRONJOB.RANGE);
    } else {
      setSpecificMonths(months.split(','));
      setMonthType(Constants.TYPE_CRONJOB.SPECIFIC);
    }
  }, [months]);
  return (
    <div className='custom-tab-pane' id='tabs-5' role='tabpanel'>
      {/* 1. Every Month */}
      <div className="custom-form-check mb-3">
        <input
          className="custom-form-check-input"
          type="radio"
          id="cronEveryMonth"
          name="cronMonth"
          checked={monthType === 'every'}
          onChange={() => setMonthType('every')}
        />
        <label className="custom-form-check-label" htmlFor="cronEveryMonth">
          Every month
        </label>
      </div>

      {/* 2. Month Increment */}
      <div className="custom-form-check mb-3">
        <input
            className="custom-form-check-input"
            type="radio"
            id="cronMonthIncrement"
            name="cronMonth"
            checked={monthType === 'increment'}
            onChange={() => setMonthType('increment')}
        />
        <label className='lable-select lable-select-every' htmlFor='cronMonthIncrement'>Every</label>
        <select
            id="cronMonthIncrementIncrement"
            value={increment}
            onChange={e => setIncrement(Number(e.target.value))}
            className='custom-select-form'
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num}
              </option>
          ))}
        </select>
        <label className='lable-select lable-select-month-right' htmlFor='cronMonthIncrement'>month(s) starting in</label>
        <select
            id="cronMonthIncrementStart"
            value={startMonth}
            onChange={e => setStartMonth(Number(e.target.value))}
            style={{ marginLeft: '5px', width: '125px' }}
        >
          {monthsAll.map((month, i) => (
              <option key={i} value={i + 1}>
                {month}
              </option>
          ))}
        </select>
      </div>

      {/* 3. Specific Months */}
      <div className="custom-form-check mb-3">
        <input
            className="custom-form-check-input"
          type="radio"
          id="cronMonthSpecific"
          name="cronMonth"
          checked={monthType === 'specific'}
          onChange={() => setMonthType('specific')}
        />
        <label className="custom-form-check-label" htmlFor="cronMonthSpecific">
          Specific month (choose one or many)
        </label>
        <div
            className={`custom-checkbox-cronjob-wrapper ${
                monthType === 'specific' ? 'show' : ''
            }`}
        >
          <div className='custom-checkbox-cronjob'>
            {monthOrder.map(month => (
                <div key={month} className='custom-col-6p' style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <input
                      className="custom-form-check-input"
                      type="checkbox"
                      id={`cronMonth${month}`}
                      value={month}
                      checked={specificMonths.includes(month)}
                      onChange={() => handleSpecificMonthsChange(month)}
                  />
                  <label
                      className="custom-form-check-label"
                      htmlFor={`cronMonth${month}`}
                  >
                    {month}
                  </label>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Month Range */}
      <div className="custom-form-check mb-3">
        <input
            className="custom-form-check-input"
            type="radio"
            id="cronMonthRange"
            name="cronMonth"
            checked={monthType === 'range'}
            onChange={() => setMonthType('range')}
        />
        <label className='lable-select lable-select-month-left' htmlFor='cronMonthRange'>Every month between</label>
        <select
            id="cronMonthRangeStart"
            value={rangeStart}
            onChange={e => setRangeStart(Number(e.target.value))}
            style={{ marginLeft: '5px', width: '125px' }}
        >
          {monthsAll.map((month, i) => (
              <option key={i} value={i + 1}>
                {month}
              </option>
          ))}
        </select>
        <label className='lable-select lable-select-month-and' htmlFor='cronMonthRange'>and</label>
        <select
            id="cronMonthRangeEnd"
            value={rangeEnd}
            onChange={e => setRangeEnd(Number(e.target.value))}
            style={{ marginLeft: '5px', width: '125px' }}
        >
          {monthsAll.map((month, i) => (
              <option key={i} value={i + 1}>
                {month}
              </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthComponent;

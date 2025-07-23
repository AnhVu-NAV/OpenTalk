import React, { useState, useEffect } from 'react';
import Constants from '../common/Constant';

const DaysContent = ({ dayOfMonth, setDayOfMonth, dayOfWeek, setDayOfWeek }) => {
  const [dayType, setDayType] = useState(Constants.TYPE_CRONJOB.EVERY);

  const [dowIncrementStep, setDowIncrementStep] = useState('1');
  const [dowIncrementStart, setDowIncrementStart] = useState('1');

  const [domIncrementStep, setDomIncrementStep] = useState('1');
  const [domIncrementStart, setDomIncrementStart] = useState('1');
  const [specificDays, setSpecificDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [nthDay, setNthDay] = useState({ nth: '1', dow: '1' });
  const [lastSpecificDay, setLastSpecificDay] = useState('1');
  const [daysBeforeEom, setDaysBeforeEom] = useState('1');

  // Dùng để detect đang sync props (từ cha) hay đang thao tác UI (nội bộ)
  const [isSyncingFromProps, setIsSyncingFromProps] = useState(false);

  // Khi user thao tác UI: tính lại cron, chỉ set lên cha nếu KHÁC giá trị cũ
  useEffect(() => {
    if (isSyncingFromProps) return; // Chặn cập nhật vòng lặp khi đang sync props

    let resultDayOfMonth = '';
    let resultDayOfWeek = '';
    switch (dayType) {
      case 'every':
        resultDayOfMonth = '?';
        resultDayOfWeek = '*';
        break;
      case 'dowIncrement':
        resultDayOfMonth = '?';
        resultDayOfWeek = `${dowIncrementStart}/${dowIncrementStep}`;
        break;
      case 'domIncrement':
        resultDayOfMonth = `${domIncrementStart}/${domIncrementStep}`;
        resultDayOfWeek = '?';
        break;
      case 'dowSpecific':
        resultDayOfMonth = '?';
        resultDayOfWeek = specificDays.length > 0 ? specificDays.join(',') : 'SUN';
        break;
      case 'domSpecific':
        resultDayOfMonth = selectedDays.join(',') || '1';
        resultDayOfWeek = '?';
        break;
      case 'lastDay':
        resultDayOfMonth = 'L';
        resultDayOfWeek = '?';
        break;
      case 'lastWeekday':
        resultDayOfMonth = 'LW';
        resultDayOfWeek = '?';
        break;
      case 'lastSpecific':
        resultDayOfMonth = '?';
        resultDayOfWeek = `${lastSpecificDay}L`;
        break;
      case 'daysBeforeEom':
        resultDayOfMonth = `L-${daysBeforeEom}`;
        resultDayOfWeek = '?';
        break;
      case 'nthDay':
        resultDayOfMonth = '?';
        resultDayOfWeek = `${nthDay.nth}#${nthDay.dow}`;
        break;
      default:
        return;
    }
    // Chỉ set lại nếu giá trị thực sự khác
    if (dayOfMonth !== resultDayOfMonth) setDayOfMonth(resultDayOfMonth);
    if (dayOfWeek !== resultDayOfWeek) setDayOfWeek(resultDayOfWeek);

    // eslint-disable-next-line
  }, [
    dayType,
    dowIncrementStep,
    dowIncrementStart,
    domIncrementStep,
    domIncrementStart,
    specificDays,
    selectedDays,
    nthDay,
    lastSpecificDay,
    daysBeforeEom,
    isSyncingFromProps, // nếu là true thì bỏ qua, chỉ update khi false (user thao tác)
  ]);

  // Khi props từ cha đổi (user chọn lại cronjob khác), sync lại state nội bộ
  useEffect(() => {
    if (!dayOfMonth || !dayOfWeek) return;
    setIsSyncingFromProps(true); // Đánh dấu đang sync
    const dayAllOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayAllOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    if (dayOfMonth === '?' && dayOfWeek === '*') {
      setDayType('every');
    } else if (dayOfMonth === '?' && dayOfWeek.includes('/')) {
      setDowIncrementStart(dayOfWeek.split('/')[0]);
      setDowIncrementStep(dayOfWeek.split('/')[1]);
      setDayType('dowIncrement');
    } else if (dayOfMonth.includes('/') && dayOfWeek === '?') {
      setDomIncrementStart(dayOfMonth.split('/')[0]);
      setDomIncrementStep(dayOfMonth.split('/')[1]);
      setDayType('domIncrement');
    } else if (dayOfMonth === '?' && (dayAllOfWeek.includes(dayOfWeek) || dayOfWeek.includes(','))) {
      setSpecificDays(dayOfWeek.split(','));
      setDayType('dowSpecific');
    } else if ((dayAllOfMonth.includes(dayOfMonth) || dayOfMonth.includes(',')) && dayOfWeek === '?') {
      setSelectedDays(dayOfMonth.split(','));
      setDayType('domSpecific');
    } else if (dayOfMonth === 'L' && dayOfWeek === '?') {
      setDayType('lastDay');
    } else if (dayOfMonth === 'LW' && dayOfWeek === '?') {
      setDayType('lastWeekday');
    } else if (dayOfMonth === '?' && dayOfWeek.endsWith('L')) {
      setLastSpecificDay(dayOfWeek.substring(0, 1));
      setDayType('lastSpecific');
    } else if (dayOfMonth.includes('L-') && dayOfWeek === '?') {
      setDaysBeforeEom(dayOfMonth.split('-')[1]);
      setDayType('daysBeforeEom');
    } else if (dayOfMonth === '?' && dayOfWeek.includes('#')) {
      setNthDay({ nth: dayOfWeek.split('#')[0], dow: dayOfWeek.split('#')[1] });
      setDayType('nthDay');
    }
    setTimeout(() => setIsSyncingFromProps(false), 0); // Sau khi sync xong, reset cờ này
    // eslint-disable-next-line
  }, [dayOfMonth, dayOfWeek]);

  const dayAllOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayAllOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const dayAll = Constants.DAYS;
  const suffixes = { 0: 'st', 1: 'nd', 2: 'rd' };

  const handleSpecificDaysChange = (day) => {
    setSpecificDays((prev) => {
      const updatedDays = prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day];
      return updatedDays.sort((a, b) => dayAllOfWeek.indexOf(a) - dayAllOfWeek.indexOf(b));
    });
  };
  const handleDaySelection = (day) => {
    setSelectedDays((prev) => {
      const updatedDays = prev.includes(day.toString())
        ? prev.filter(d => d !== day.toString())
        : [...prev, day.toString()];
      return updatedDays.sort((a, b) => a - b);
    });
  };

  const monthOrder = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];
  
  return (
    <div className='custom-tab-pane' id='tabs-4' role='tabpanel'>
      <div>
        {/* ... UI giữ nguyên như cũ ... */}
        {/* 1. Every day */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronEveryDay'
              name='cronDay'
              checked={dayType === 'every'}
              onChange={() => setDayType('every')}
          />
          <label className='custom-form-check-label' htmlFor='cronEveryDay'>
            Every day
          </label>
        </div>

        {/* 2. Day of the week increment */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronDowIncrement'
              name='cronDay'
              checked={dayType === 'dowIncrement'}
              onChange={() => setDayType('dowIncrement')}
          />
          <label className='lable-select lable-select-every' htmlFor='cronDowIncrement'>Every</label>
          <select
              value={dowIncrementStep}
              onChange={e => setDowIncrementStep(e.target.value)}
              className='custom-select-form'
          >
            {Array.from({ length: 7 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
            ))}
          </select>{' '}
          <label className='lable-select lable-select-day-right' htmlFor='cronDowIncrement'>day(s) starting on</label>
          <select
              value={dowIncrementStart}
              onChange={e => setDowIncrementStart(e.target.value)}
              style={{ width: '125px' }}
          >
            {dayAll.map((day, i) => (
                <option key={i} value={i + 1}>
                  {day}
                </option>
            ))}
          </select>
        </div>

        {/* 3. Day of the month increment */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronDomIncrement'
              name='cronDay'
              checked={dayType === 'domIncrement'}
              onChange={() => setDayType('domIncrement')}
          />
          <label className='lable-select lable-select-every' htmlFor='cronDomIncrement'>Every</label>
          <select
              value={domIncrementStep}
              onChange={e => setDomIncrementStep(e.target.value)}
              className='custom-select-form'
          >
            {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
            ))}
          </select>{' '}
          <label className='lable-select lable-select-day-right' htmlFor='cronDomIncrement'>day(s) starting on</label>
          <select
              value={domIncrementStart}
              onChange={e => setDomIncrementStart(e.target.value)}
              className='custom-select-form'
          >
            {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
            ))}
          </select>
          <label className='lable-select lable-select-day-right' htmlFor='cronDomIncrement'>of the month</label>
        </div>

        {/* 4. Specific days of the week */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronDowSpecific'
              name='cronDay'
              checked={dayType === 'dowSpecific'}
              onChange={() => setDayType('dowSpecific')}
          />
          <label className='custom-form-check-label' htmlFor='cronDowSpecific'>
            Specific day(s) of the week
          </label>
          <div
              className={`custom-checkbox-cronjob-wrapper ${
                  dayType === 'dowSpecific' ? 'show' : ''
              }`}
              style={{ width: '100%' }}
          >
            <div className='custom-checkbox-cronjob' style={{ width: '100%' }}>
              {dayAllOfWeek.map(day => (
                  <div key={day} className='custom-col-6p' style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <input
                        className='custom-form-check-input'
                        type='checkbox'
                        value={day}
                        id={`cronDowSpecific${day}`}
                        checked={specificDays.includes(day)}
                        onChange={() => handleSpecificDaysChange(day)}
                    />
                    <label className='custom-form-check-label' htmlFor={`cronDowSpecific${day}`}>
                      {day}
                    </label>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Specific days of the month */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronSpecificDays'
              name='cronDay'
              checked={dayType === 'domSpecific'}
              onChange={() => setDayType('domSpecific')}
          />
          <label className='custom-form-check-label' htmlFor='cronSpecificDays'>
            Specific day(s) of the month
          </label>
          <div
              className={`custom-checkbox-cronjob-wrapper ${
                  dayType === 'domSpecific' ? 'show' : ''
              }`}
          >
            <div className='custom-checkbox-cronjob'>
              {dayAllOfMonth.map((day, i) => (
                  <div key={i} className='custom-col-6p' style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <input
                        className='custom-form-check-input'
                        type='checkbox'
                        value={day}
                        id={`cronSpecificDays${i}`}
                        checked={selectedDays.includes(day.toString())}
                        onChange={() => handleDaySelection(day)}
                    />
                    <label className='custom-form-check-label' htmlFor={`cronSpecificDays${i}`}>
                      {day.toString().padStart(2, '0')}
                    </label>
                  </div>
              ))}
            </div>
          </div>
        </div>
        {/* 6. Last day of the month */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronLastDay'
              name='cronDay'
              checked={dayType === 'lastDay'}
              onChange={() => setDayType('lastDay')}
          />
          <label className='custom-form-check-label' htmlFor='cronLastDay'>
            Last day of the month
          </label>
        </div>

        {/* 7. Last weekday of the month */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronLastWeekday'
              name='cronDay'
              checked={dayType === 'lastWeekday'}
              onChange={() => setDayType('lastWeekday')}
          />
          <label className='custom-form-check-label' htmlFor='cronLastWeekday'>
            Last weekday of the month
          </label>
        </div>

        {/* 8. Last specific weekday */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronLastSpecific'
              name='cronDay'
              checked={dayType === 'lastSpecific'}
              onChange={() => setDayType('lastSpecific')}
          />
          <label className='lable-select' htmlFor='cronLastSpecific'>On the last</label>
          <select
              value={lastSpecificDay}
              onChange={e => setLastSpecificDay(e.target.value)}
              style={{ marginLeft: '5px', marginRight: '5px' }}
          >
            {dayAll.map((day, index) => (
                <option key={index} value={index + 1}>
                  {day}
                </option>))
            }
          </select>
          <label className='lable-select lable-select-day-right' htmlFor='cronLastSpecific'>of the month</label>
        </div>


        {/* 9. Days before the end of the month */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronDaysBeforeEom'
              name='cronDay'
              checked={dayType === 'daysBeforeEom'}
              onChange={() => setDayType('daysBeforeEom')}
          />
          <label className='lable-select' htmlFor='cronDaysBeforeEom'>On the last</label>
          <select
              value={daysBeforeEom}
              onChange={e => setDaysBeforeEom(e.target.value)}
              style={{ marginLeft: '5px', marginRight: '5px' }}
          >
            {[...Array(31).keys()].map(i => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} day(s)
                </option>
            ))}
          </select>
          <label className='lable-select lable-select-range-right' htmlFor='cronDaysBeforeEom'>before the end of the month</label>
        </div>

        {/* 10. Nth weekday of a specific month */}
        <div className='custom-form-check mb-3'>
          <input
              className='custom-form-check-input'
              type='radio'
              id='cronNthDay'
              name='cronDay'
              checked={dayType === 'nthDay'}
              onChange={() => setDayType('nthDay')}
          />
          <label className='lable-select lable-select-nth' htmlFor='cronNthDay'>On the</label>
          <select
              value={nthDay.nth}
              onChange={e => setNthDay({ ...nthDay, nth: e.target.value })}
              style={{ marginLeft: '5px', marginRight: '5px' }}
          >
            {[...Array(5).keys()].map(i => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}{suffixes[i] || 'th'}
                </option>
            ))}
          </select>
          <select
              value={nthDay.dow}
              onChange={e => setNthDay({ ...nthDay, dow: e.target.value })}
              style={{ marginLeft: '5px', marginRight: '5px' }}
          >
            {dayAll.map((day, i) => (
                <option key={i} value={i + 1}>
                  {day}
                </option>
            ))}
          </select>
          <label className='lable-select lable-select-range-right' htmlFor='cronNthDay'>Of the month</label>
        </div>
      </div>
    </div>
  );
};

export default DaysContent;

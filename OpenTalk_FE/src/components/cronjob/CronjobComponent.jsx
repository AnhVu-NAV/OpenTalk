import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import cronstrue from 'cronstrue';
import SecondsComponent from './SecondsComponent';
import MinutesContent from './MinutesComponent';
import HoursComponent from './HoursComponent';
import DayContent from './DayComponent';
import MonthComponent from './MonthComponent';
import '../scss/_cronjobManage.scss';
import '../scss/_cronjobSettings.scss';
import { getListCronjob, saveCronjob } from '../../api/apiList';

const customToastId = {
    success: 'toastIdSuccess',
    failure: 'toastIdFailure',
    warn: 'toastIdWarn',
};

const CronJobComponent = () => {
    const [seconds, setSeconds] = useState('');
    const [minutes, setMinutes] = useState('');
    const [hours, setHours] = useState('');
    const [dayOfMonth, setDayOfMonth] = useState('?');
    const [dayOfWeek, setDayOfWeek] = useState('*');
    const [months, setMonths] = useState('*');
    const [activeTab, setActiveTab] = useState('tabs-1');
    const [selectedCronjobValue, setSelectedCronjobValue] = useState('');
    const [selectedCronjobKey, setSelectedCronjobKey] = useState('');
    const [cronjobList, setCronjobList] = useState([]);
    const [statusChangeToFetch, setStatusChangeToFetch] = useState(true);

    // Thêm trigger để đảm bảo render khi các trường đã cập nhật xong
    const [fieldsReady, setFieldsReady] = useState(false);

    // Parse cron và báo hiệu fields ready
    const handleParseCronjob = (cronjob) => {
        const cronjobArray = cronjob.split(' ');
        setSeconds(cronjobArray[0]);
        setMinutes(cronjobArray[1]);
        setHours(cronjobArray[2]);
        setDayOfMonth(cronjobArray[3]);
        setMonths(cronjobArray[4]);
        setDayOfWeek(cronjobArray[5]);
        setFieldsReady(false); // Đánh dấu chưa sẵn sàng
        setTimeout(() => setFieldsReady(true), 0); // Chờ render xong mới ready
    };

    const handleCronjobSelect = useCallback(
        (newEvent) => {
            const selectedKey = newEvent.target.value;
            if (selectedKey) {
                const cronjob = cronjobList.find(cronjobItem => cronjobItem.cronjobKey === selectedKey);
                if (cronjob) {
                    setSelectedCronjobValue(cronjob.cronjobValue);
                    setSelectedCronjobKey(cronjob.cronjobKey);
                    handleParseCronjob(cronjob.cronjobValue);
                } else {
                    setSelectedCronjobValue('');
                    setSelectedCronjobKey('');
                    toast.warn('Selected cronjob not found.', {
                        toastId: customToastId.warn,
                    });
                }
            } else {
                setSelectedCronjobValue('');
                setSelectedCronjobKey('');
            }
        },
        [cronjobList],
    );
    useEffect(() => {
        const getAllCronjob = async () => {
            try {
                const res = await getListCronjob();
                setCronjobList(res);
            } catch (error) {
                toast.error('Failed to fetch cronjobs!', {
                    toastId: customToastId.failure,
                });
                console.error('Fetch Cronjob Error:', error);
            }
        };
        getAllCronjob();
    }, [statusChangeToFetch]);

    const convertToCronExpression = () => {
        return `${seconds || '0'} ${minutes || '0'} ${hours || '0'} ${dayOfMonth || '*'} ${months || '*'} ${dayOfWeek || '*'}`;
    };
    const handleCronExpression = () => {
        const cronExpression = convertToCronExpression();
        return cronstrue.toString(cronExpression);
    };
    const handleSaveCronjob = async () => {
        if (selectedCronjobKey) {
            try {
                const newExpression = convertToCronExpression();

                const newCronjob = {
                    cronjobKey: selectedCronjobKey,
                    cronjobValue: newExpression,
                };

                await saveCronjob(newCronjob);

                setSelectedCronjobValue(newExpression);

                toast.success('Cronjob saved successfully!', {
                    toastId: customToastId.success,
                });
                setStatusChangeToFetch(!statusChangeToFetch);
            } catch (error) {
                toast.error('Error saving cronjob!', {
                    toastId: customToastId.failure,
                });
            }
        } else {
            toast.warn('No cronjob key selected', {
                toastId: customToastId.warn,
            });
        }
    };

    return (
        <div className="cronjob-container">
            {/* Cronjob Selector */}
            <div className='cronjob-container-selection'>
                <div className='cronjob-select-wrapper'>
                    <div className='cronjob-select-container'>
                        <label htmlFor='cronjob-select' className='cronjob-select'>Select Cronjob:</label>
                        <select
                            id='cronjob-select'
                            value={selectedCronjobKey}
                            onChange={handleCronjobSelect}
                        >
                            <option value=''>-- Select Cronjob --</option>
                            {cronjobList.map(job => (
                                <option key={job.cronjobKey} value={job.cronjobKey}>
                                    {job.cronjobKey.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            { selectedCronjobKey &&
                <div>
                    {/* Navbar */}
                    <ul className="custom-tabs">
                        {[
                            { id: 'tabs-1', label: 'Seconds' },
                            { id: 'tabs-2', label: 'Minutes' },
                            { id: 'tabs-3', label: 'Hours' },
                            { id: 'tabs-4', label: 'Day' },
                            { id: 'tabs-5', label: 'Month' },
                        ].map(tab => (
                            <li key={tab.id} className="custom-tab-item">
                                <button
                                    className={`custom-tab-link ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {/* Tab Content */}
                    <div className="custom-tab-content">
                        <div style={{ display: activeTab === 'tabs-1' ? 'block' : 'none' }}>
                            <SecondsComponent seconds={seconds} setSeconds={setSeconds}/>
                        </div>
                        <div style={{ display: activeTab === 'tabs-2' ? 'block' : 'none' }}>
                            <MinutesContent minutes={minutes} setMinutes={setMinutes}/>
                        </div>
                        <div style={{ display: activeTab === 'tabs-3' ? 'block' : 'none' }}>
                            <HoursComponent hours={hours} setHours={setHours}/>
                        </div>
                        <div style={{ display: activeTab === 'tabs-4' ? 'block' : 'none' }}>
                            <DayContent
                                dayOfMonth={dayOfMonth}
                                setDayOfMonth={setDayOfMonth}
                                dayOfWeek={dayOfWeek}
                                setDayOfWeek={setDayOfWeek}
                            />
                        </div>
                        <div style={{ display: activeTab === 'tabs-5' ? 'block' : 'none' }}>
                            <MonthComponent months={months} setMonths={setMonths}/>
                        </div>
                        <div className='cronjob-save'>
                            <button onClick={handleSaveCronjob}>Save</button>
                        </div>
                    </div>
                    {/* Cron Expression */}
                    {fieldsReady && (
                        <div className="custom-cron-expression">
                            <h5>Cron Expression</h5>
                            <table className="cron-expression-table-horizontal">
                                <thead>
                                <tr>
                                    <th>Seconds</th>
                                    <th>Minutes</th>
                                    <th>Hours</th>
                                    <th>Day of Month</th>
                                    <th>Months</th>
                                    <th>Day of Week</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{seconds}</td>
                                    <td>{minutes}</td>
                                    <td>{hours}</td>
                                    <td>{dayOfMonth}</td>
                                    <td>{months}</td>
                                    <td>{dayOfWeek}</td>
                                </tr>
                                </tbody>
                            </table>
                            <h5>Describe Expression</h5>
                            <div>{handleCronExpression()}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

export default CronJobComponent;

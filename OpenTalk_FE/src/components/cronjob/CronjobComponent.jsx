import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import cronstrue from "cronstrue"
import SecondsComponent from "./SecondsComponent"
import MinutesContent from "./MinutesComponent"
import HoursComponent from "./HoursComponent"
import DayContent from "./DayComponent"
import MonthComponent from "./MonthComponent"
import styles from "./styles/CronjobComponent.module.css"
import { getListCronjob, saveCronjob } from "../../api/apiList"

const customToastId = {
    success: "toastIdSuccess",
    failure: "toastIdFailure",
    warn: "toastIdWarn",
}

const CronJobComponent = () => {
    const [seconds, setSeconds] = useState("")
    const [minutes, setMinutes] = useState("")
    const [hours, setHours] = useState("")
    const [dayOfMonth, setDayOfMonth] = useState("?")
    const [dayOfWeek, setDayOfWeek] = useState("*")
    const [months, setMonths] = useState("*")
    const [activeTab, setActiveTab] = useState("tabs-1")
    const [selectedCronjobValue, setSelectedCronjobValue] = useState("")
    const [selectedCronjobKey, setSelectedCronjobKey] = useState("")
    const [cronjobList, setCronjobList] = useState([])
    const [statusChangeToFetch, setStatusChangeToFetch] = useState(true)
    const [fieldsReady, setFieldsReady] = useState(false)

    const handleParseCronjob = (cronjob) => {
        const cronjobArray = cronjob.split(" ")
        setSeconds(cronjobArray[0])
        setMinutes(cronjobArray[1])
        setHours(cronjobArray[2])
        setDayOfMonth(cronjobArray[3])
        setMonths(cronjobArray[4])
        setDayOfWeek(cronjobArray[5])
        setFieldsReady(false)
        setTimeout(() => setFieldsReady(true), 0)
    }

    const handleCronjobSelect = useCallback(
        (newEvent) => {
            const selectedKey = newEvent.target.value
            if (selectedKey) {
                const cronjob = cronjobList.find((cronjobItem) => cronjobItem.cronjobKey === selectedKey)
                if (cronjob) {
                    setSelectedCronjobValue(cronjob.cronjobValue)
                    setSelectedCronjobKey(cronjob.cronjobKey)
                    handleParseCronjob(cronjob.cronjobValue)
                } else {
                    setSelectedCronjobValue("")
                    setSelectedCronjobKey("")
                    toast.warn("Selected cronjob not found.", {
                        toastId: customToastId.warn,
                    })
                }
            } else {
                setSelectedCronjobValue("")
                setSelectedCronjobKey("")
            }
        },
        [cronjobList],
    )

    useEffect(() => {
        const getAllCronjob = async () => {
            try {
                const res = await getListCronjob()
                setCronjobList(res)
            } catch (error) {
                toast.error("Failed to fetch cronjobs!", {
                    toastId: customToastId.failure,
                })
                console.error("Fetch Cronjob Error:", error)
            }
        }
        getAllCronjob()
    }, [statusChangeToFetch])

    const convertToCronExpression = () => {
        return `${seconds || "0"} ${minutes || "0"} ${hours || "0"} ${dayOfMonth || "*"} ${months || "*"} ${dayOfWeek || "*"}`
    }

    const handleCronExpression = () => {
        const cronExpression = convertToCronExpression()
        return cronstrue.toString(cronExpression)
    }

    const handleSaveCronjob = async () => {
        if (selectedCronjobKey) {
            try {
                const newExpression = convertToCronExpression()
                const newCronjob = {
                    cronjobKey: selectedCronjobKey,
                    cronjobValue: newExpression,
                }
                await saveCronjob(newCronjob)
                setSelectedCronjobValue(newExpression)
                toast.success("Cronjob saved successfully!", {
                    toastId: customToastId.success,
                })
                setStatusChangeToFetch(!statusChangeToFetch)
            } catch (error) {
                toast.error("Error saving cronjob!", {
                    toastId: customToastId.failure,
                })
            }
        } else {
            toast.warn("No cronjob key selected", {
                toastId: customToastId.warn,
            })
        }
    }

    return (
        <div className={styles.cronjobContainer}>
            <div className={styles.cronjobContainerSelection}>
                <div className={styles.cronjobSelectWrapper}>
                    <div className={styles.cronjobSelectContainer}>
                        <label htmlFor="cronjob-select" className={styles.cronjobSelect}>
                            Select Cronjob:
                        </label>
                        <select
                            id="cronjob-select"
                            value={selectedCronjobKey}
                            onChange={handleCronjobSelect}
                            className={styles.cronjobSelectDropdown}
                        >
                            <option value="">-- Select Cronjob --</option>
                            {cronjobList.map((job) => (
                                <option key={job.cronjobKey} value={job.cronjobKey}>
                                    {job.cronjobKey.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {selectedCronjobKey && (
                <div>
                    <ul className={styles.customTabs}>
                        {[
                            { id: "tabs-1", label: "Seconds" },
                            { id: "tabs-2", label: "Minutes" },
                            { id: "tabs-3", label: "Hours" },
                            { id: "tabs-4", label: "Day" },
                            { id: "tabs-5", label: "Month" },
                        ].map((tab) => (
                            <li key={tab.id} className={styles.customTabItem}>
                                <button
                                    className={`${styles.customTabLink} ${activeTab === tab.id ? styles.active : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.customTabContent}>
                        <div style={{ display: activeTab === "tabs-1" ? "block" : "none" }}>
                            <SecondsComponent seconds={seconds} setSeconds={setSeconds} />
                        </div>
                        <div style={{ display: activeTab === "tabs-2" ? "block" : "none" }}>
                            <MinutesContent minutes={minutes} setMinutes={setMinutes} />
                        </div>
                        <div style={{ display: activeTab === "tabs-3" ? "block" : "none" }}>
                            <HoursComponent hours={hours} setHours={setHours} />
                        </div>
                        <div style={{ display: activeTab === "tabs-4" ? "block" : "none" }}>
                            <DayContent
                                dayOfMonth={dayOfMonth}
                                setDayOfMonth={setDayOfMonth}
                                dayOfWeek={dayOfWeek}
                                setDayOfWeek={setDayOfWeek}
                            />
                        </div>
                        <div style={{ display: activeTab === "tabs-5" ? "block" : "none" }}>
                            <MonthComponent months={months} setMonths={setMonths} />
                        </div>
                        <div className={styles.cronjobSave}>
                            <button onClick={handleSaveCronjob} className={styles.saveButton}>
                                Save
                            </button>
                        </div>
                    </div>

                    {fieldsReady && (
                        <div className={styles.customCronExpression}>
                            <h5>Cron Expression</h5>
                            <table className={styles.cronExpressionTableHorizontal}>
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
                            <div className={styles.expressionDescription}>{handleCronExpression()}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CronJobComponent

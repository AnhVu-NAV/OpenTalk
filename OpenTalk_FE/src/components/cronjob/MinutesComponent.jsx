import { useState, useEffect } from "react"
import Constants from "../common/Constant"
import styles from "./styles/MinutesComponent.module.css"

const MinuteScheduler = ({ minutes, setMinutes }) => {
  const [minuteType, setMinuteType] = useState("")
  const [incrementStart, setIncrementStart] = useState("0")
  const [incrementStep, setIncrementStep] = useState("1")
  const [specificMinutes, setSpecificMinutes] = useState([])
  const [rangeStart, setRangeStart] = useState("0")
  const [rangeEnd, setRangeEnd] = useState("0")

  useEffect(() => {
    if (!minutes) return

    if (minutes.includes("*")) {
      setMinuteType(Constants.TYPE_CRONJOB.EVERY)
    } else if (minutes.includes("/")) {
      const increments = minutes.split("/")
      setIncrementStart(increments[0])
      setIncrementStep(increments[1])
      setMinuteType(Constants.TYPE_CRONJOB.INCREMENT)
    } else if (minutes.includes("-")) {
      const ranges = minutes.split("-")
      setRangeStart(ranges[0])
      setRangeEnd(ranges[1])
      setMinuteType(Constants.TYPE_CRONJOB.RANGE)
    } else {
      setSpecificMinutes(minutes.split(","))
      setMinuteType(Constants.TYPE_CRONJOB.SPECIFIC)
    }
  }, [minutes])

  useEffect(() => {
    let result = ""
    if (minuteType === Constants.TYPE_CRONJOB.EVERY) {
      result = "*"
    } else if (minuteType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${incrementStart}/${incrementStep}`
    } else if (minuteType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificMinutes.length > 0 ? specificMinutes.join(",") : "0"
    } else if (minuteType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`
    } else {
      return
    }
    setMinutes(result)
  }, [minuteType, incrementStart, incrementStep, specificMinutes, rangeStart, rangeEnd])

  const handleSpecificChange = (minute) => {
    setSpecificMinutes((prev) => {
      const updatedMinutes = prev.includes(minute) ? prev.filter((m) => m !== minute) : [...prev, minute]
      return updatedMinutes.sort((a, b) => a - b)
    })
  }

  return (
      <div className={styles.customTabPane} id="tabs-2" role="tabpanel">
        <div>
          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronEveryMinute"
                name="cronMinute"
                checked={minuteType === "every"}
                onChange={() => setMinuteType("every")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronEveryMinute">
              Every minute
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronMinuteIncrement"
                name="cronMinute"
                checked={minuteType === "increment"}
                onChange={() => setMinuteType("increment")}
            />
            <label className={styles.labelSelect} htmlFor="cronMinuteIncrement">
              Every
            </label>
            <select
                id="cronMinuteIncrementIncrement"
                className={styles.customSelectForm}
                value={incrementStep}
                onChange={(e) => setIncrementStep(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronMinuteIncrement">
              minute(s) starting at minute
            </label>
            <select
                id="cronMinuteIncrementStart"
                className={styles.customSelectForm}
                value={incrementStart}
                onChange={(e) => setIncrementStart(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
              ))}
            </select>
          </div>

          <div className={styles.customFormCheck}>
            <input
                type="radio"
                className={styles.customFormCheckInput}
                id="cronMinuteSpecific"
                name="cronMinute"
                checked={minuteType === "specific"}
                onChange={() => setMinuteType("specific")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronMinuteSpecific">
              Specific minute (choose one or many)
            </label>
            <div className={`${styles.customCheckboxCronjobWrapper} ${minuteType === "specific" ? styles.show : ""}`}>
              <div className={styles.customCheckboxCronjob}>
                {Array.from({ length: 60 }, (_, i) => (
                    <div key={i} className={styles.customCol6p}>
                      <input
                          className={styles.customFormCheckInput}
                          name="cronMinuteSpecificSpecific"
                          type="checkbox"
                          id={`cronMinute${i}`}
                          value={i}
                          checked={specificMinutes.includes(i.toString())}
                          onChange={() => handleSpecificChange(i.toString())}
                      />
                      <label className={styles.customFormCheckLabel} htmlFor={`cronMinute${i}`}>
                        {i.toString().padStart(2, "0")}
                      </label>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronMinuteRange"
                name="cronMinute"
                checked={minuteType === "range"}
                onChange={() => setMinuteType("range")}
            />
            <label className={styles.labelSelectRangeLeft} htmlFor="cronMinuteRange">
              Every minute between minute
            </label>
            <select
                id="cronMinuteRangeStart"
                className={styles.customSelectForm}
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelect} htmlFor="cronMinuteRange">
              and minute
            </label>
            <select
                id="cronMinuteRangeEnd"
                className={styles.customSelectForm}
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
              ))}
            </select>
          </div>
        </div>
      </div>
  )
}

export default MinuteScheduler

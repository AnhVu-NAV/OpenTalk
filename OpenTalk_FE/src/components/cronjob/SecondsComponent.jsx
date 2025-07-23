import { useState, useEffect } from "react"
import Constants from "../common/Constant"
import styles from "./styles/SecondsComponent.module.css"

const SecondsComponent = ({ seconds, setSeconds }) => {
  const [secondType, setSecondType] = useState("")
  const [incrementStart, setIncrementStart] = useState("0")
  const [incrementStep, setIncrementStep] = useState("1")
  const [specificSeconds, setSpecificSeconds] = useState([])
  const [rangeStart, setRangeStart] = useState("0")
  const [rangeEnd, setRangeEnd] = useState("0")

  useEffect(() => {
    if (!seconds) return
    if (seconds.includes("*")) {
      setSecondType(Constants.TYPE_CRONJOB.EVERY)
    } else if (seconds.includes("/")) {
      const increments = seconds.split("/")
      setIncrementStart(increments[0])
      setIncrementStep(increments[1])
      setSecondType(Constants.TYPE_CRONJOB.INCREMENT)
    } else if (seconds.includes("-")) {
      const ranges = seconds.split("-")
      setRangeStart(ranges[0])
      setRangeEnd(ranges[1])
      setSecondType(Constants.TYPE_CRONJOB.RANGE)
    } else {
      setSpecificSeconds(seconds.split(","))
      setSecondType(Constants.TYPE_CRONJOB.SPECIFIC)
    }
  }, [seconds])

  useEffect(() => {
    let result = ""
    if (secondType === Constants.TYPE_CRONJOB.EVERY) {
      result = "*"
    } else if (secondType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${incrementStart}/${incrementStep}`
    } else if (secondType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificSeconds.length > 0 ? specificSeconds.join(",") : "0"
    } else if (secondType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`
    } else {
      return
    }
    setSeconds(result)
  }, [secondType, incrementStart, incrementStep, specificSeconds, rangeStart, rangeEnd])

  const handleSpecificChange = (second) => {
    setSpecificSeconds((prev) => {
      const updatedSecondsSpecific = prev.includes(second) ? prev.filter((s) => s !== second) : [...prev, second]
      return updatedSecondsSpecific.sort((a, b) => a - b)
    })
  }

  return (
      <div className={styles.customTabPane} id="tabs-2" role="tabpanel">
        <div>
          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronEverySecond"
                name="cronSecond"
                checked={secondType === "every"}
                onChange={() => setSecondType("every")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronEverySecond">
              Every second
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronSecondIncrement"
                name="cronSecond"
                checked={secondType === "increment"}
                onChange={() => setSecondType("increment")}
            />
            <label className={styles.labelSelect} htmlFor="cronSecondIncrement">
              Every
            </label>
            <select
                id="cronSecondIncrementIncrement"
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
            <label className={styles.labelSelectIncrement} htmlFor="cronSecondIncrement">
              {" "}
              second(s) starting at second
            </label>
            <select
                id="cronSecondIncrementStart"
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
                id="cronSecondSpecific"
                name="cronSecond"
                checked={secondType === "specific"}
                onChange={() => setSecondType("specific")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronSecondSpecific">
              Specific second (choose one or many)
            </label>
            <div className={`${styles.customCheckboxCronjobWrapper} ${secondType === "specific" ? styles.show : ""}`}>
              <div className={styles.customCheckboxCronjob}>
                {Array.from({ length: 60 }, (_, i) => (
                    <div key={i} className={styles.customCol6p}>
                      <input
                          className={styles.customFormCheckInput}
                          name="cronSecondSpecificSpecific"
                          type="checkbox"
                          id={`cronSecond${i}`}
                          value={i}
                          checked={specificSeconds.includes(i.toString())}
                          onChange={() => handleSpecificChange(i.toString())}
                      />
                      <label className={styles.customFormCheckLabel} htmlFor={`cronSecond${i}`}>
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
                id="cronSecondRange"
                name="cronSecond"
                checked={secondType === "range"}
                onChange={() => setSecondType("range")}
            />
            <label className={styles.labelSelectRangeLeft} htmlFor="cronSecondRange">
              Every second between second
            </label>
            <div className={styles.customCheckboxCronjob}>
              <select
                  id="cronSecondRangeStart"
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
            </div>
            <label className={styles.labelSelectRangeRight} htmlFor="cronSecondRange">
              and second
            </label>
            <div className={styles.customCheckboxCronjob}>
              <select
                  id="cronSecondRangeEnd"
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
      </div>
  )
}

export default SecondsComponent

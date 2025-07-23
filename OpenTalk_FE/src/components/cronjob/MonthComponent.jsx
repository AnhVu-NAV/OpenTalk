import { useState, useEffect } from "react"
import Constants from "../common/Constant"
import styles from "./styles/MonthComponent.module.css"

const MonthComponent = ({ months, setMonths }) => {
  const [monthType, setMonthType] = useState(Constants.TYPE_CRONJOB.EVERY)
  const [increment, setIncrement] = useState(1)
  const [startMonth, setStartMonth] = useState(1)
  const [specificMonths, setSpecificMonths] = useState([])
  const [rangeStart, setRangeStart] = useState(1)
  const [rangeEnd, setRangeEnd] = useState(12)
  const [isSyncingFromProps, setIsSyncingFromProps] = useState(false)

  const monthOrder = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  const monthsAll = Constants.MONTHS

  const handleSpecificMonthsChange = (month) => {
    setSpecificMonths((prev) => {
      const updated = prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
      return updated.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
    })
  }

  useEffect(() => {
    if (isSyncingFromProps) return
    let result = ""

    if (monthType === Constants.TYPE_CRONJOB.EVERY) {
      result = "*"
    } else if (monthType === Constants.TYPE_CRONJOB.INCREMENT) {
      result = `${startMonth}/${increment}`
    } else if (monthType === Constants.TYPE_CRONJOB.SPECIFIC) {
      result = specificMonths.length > 0 ? specificMonths.join(",") : "JAN"
    } else if (monthType === Constants.TYPE_CRONJOB.RANGE) {
      result = `${rangeStart}-${rangeEnd}`
    } else {
      return
    }

    if (months !== result) setMonths(result)
  }, [monthType, increment, startMonth, specificMonths, rangeStart, rangeEnd, isSyncingFromProps])

  useEffect(() => {
    if (!months) return
    setIsSyncingFromProps(true)

    if (months.includes("*")) {
      setMonthType(Constants.TYPE_CRONJOB.EVERY)
    } else if (months.includes("/")) {
      const increments = months.split("/")
      setIncrement(Number(increments[1]))
      setStartMonth(Number(increments[0]))
      setMonthType(Constants.TYPE_CRONJOB.INCREMENT)
    } else if (months.includes("-")) {
      const ranges = months.split("-")
      setRangeStart(Number(ranges[0]))
      setRangeEnd(Number(ranges[1]))
      setMonthType(Constants.TYPE_CRONJOB.RANGE)
    } else {
      setSpecificMonths(months.split(","))
      setMonthType(Constants.TYPE_CRONJOB.SPECIFIC)
    }
    setTimeout(() => setIsSyncingFromProps(false), 0)
  }, [months])

  return (
      <div className={styles.customTabPane} id="tabs-5" role="tabpanel">
        <div className={styles.customFormCheck}>
          <input
              className={styles.customFormCheckInput}
              type="radio"
              id="cronEveryMonth"
              name="cronMonth"
              checked={monthType === "every"}
              onChange={() => setMonthType("every")}
          />
          <label className={styles.customFormCheckLabel} htmlFor="cronEveryMonth">
            Every month
          </label>
        </div>

        <div className={styles.customFormCheck}>
          <input
              className={styles.customFormCheckInput}
              type="radio"
              id="cronMonthIncrement"
              name="cronMonth"
              checked={monthType === "increment"}
              onChange={() => setMonthType("increment")}
          />
          <label className={styles.labelSelect} htmlFor="cronMonthIncrement">
            Every
          </label>
          <select
              id="cronMonthIncrementIncrement"
              value={increment}
              onChange={(e) => setIncrement(Number(e.target.value))}
              className={styles.customSelectForm}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
            ))}
          </select>
          <label className={styles.labelSelectIncrement} htmlFor="cronMonthIncrement">
            month(s) starting in
          </label>
          <select
              id="cronMonthIncrementStart"
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              className={styles.customSelectFormWide}
          >
            {monthsAll.map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
            ))}
          </select>
        </div>

        <div className={styles.customFormCheck}>
          <input
              className={styles.customFormCheckInput}
              type="radio"
              id="cronMonthSpecific"
              name="cronMonth"
              checked={monthType === "specific"}
              onChange={() => setMonthType("specific")}
          />
          <label className={styles.customFormCheckLabel} htmlFor="cronMonthSpecific">
            Specific month (choose one or many)
          </label>
          <div className={`${styles.customCheckboxCronjobWrapper} ${monthType === "specific" ? styles.show : ""}`}>
            <div className={styles.customCheckboxCronjob}>
              {monthOrder.map((month) => (
                  <div key={month} className={styles.customCol6p}>
                    <input
                        className={styles.customFormCheckInput}
                        type="checkbox"
                        id={`cronMonth${month}`}
                        value={month}
                        checked={specificMonths.includes(month)}
                        onChange={() => handleSpecificMonthsChange(month)}
                    />
                    <label className={styles.customFormCheckLabel} htmlFor={`cronMonth${month}`}>
                      {month}
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
              id="cronMonthRange"
              name="cronMonth"
              checked={monthType === "range"}
              onChange={() => setMonthType("range")}
          />
          <label className={styles.labelSelectRangeLeft} htmlFor="cronMonthRange">
            Every month between
          </label>
          <select
              id="cronMonthRangeStart"
              value={rangeStart}
              onChange={(e) => setRangeStart(Number(e.target.value))}
              className={styles.customSelectFormWide}
          >
            {monthsAll.map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
            ))}
          </select>
          <label className={styles.labelSelectRangeCenter} htmlFor="cronMonthRange">
            and
          </label>
          <select
              id="cronMonthRangeEnd"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(Number(e.target.value))}
              className={styles.customSelectFormWide}
          >
            {monthsAll.map((month, i) => (
                <option key={i} value={i + 1}>
                  {month}
                </option>
            ))}
          </select>
        </div>
      </div>
  )
}

export default MonthComponent

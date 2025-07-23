import { useState, useEffect } from "react"
import Constants from "../common/Constant"
import styles from "./styles/DayComponent.module.css"

const DaysContent = ({ dayOfMonth, setDayOfMonth, dayOfWeek, setDayOfWeek }) => {
  const [dayType, setDayType] = useState(Constants.TYPE_CRONJOB.EVERY)
  const [dowIncrementStep, setDowIncrementStep] = useState("1")
  const [dowIncrementStart, setDowIncrementStart] = useState("1")
  const [domIncrementStep, setDomIncrementStep] = useState("1")
  const [domIncrementStart, setDomIncrementStart] = useState("1")
  const [specificDays, setSpecificDays] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [nthDay, setNthDay] = useState({ nth: "1", dow: "1" })
  const [lastSpecificDay, setLastSpecificDay] = useState("1")
  const [daysBeforeEom, setDaysBeforeEom] = useState("1")
  const [isSyncingFromProps, setIsSyncingFromProps] = useState(false)

  useEffect(() => {
    if (isSyncingFromProps) return

    let resultDayOfMonth = ""
    let resultDayOfWeek = ""
    switch (dayType) {
      case "every":
        resultDayOfMonth = "?"
        resultDayOfWeek = "*"
        break
      case "dowIncrement":
        resultDayOfMonth = "?"
        resultDayOfWeek = `${dowIncrementStart}/${dowIncrementStep}`
        break
      case "domIncrement":
        resultDayOfMonth = `${domIncrementStart}/${domIncrementStep}`
        resultDayOfWeek = "?"
        break
      case "dowSpecific":
        resultDayOfMonth = "?"
        resultDayOfWeek = specificDays.length > 0 ? specificDays.join(",") : "SUN"
        break
      case "domSpecific":
        resultDayOfMonth = selectedDays.join(",") || "1"
        resultDayOfWeek = "?"
        break
      case "lastDay":
        resultDayOfMonth = "L"
        resultDayOfWeek = "?"
        break
      case "lastWeekday":
        resultDayOfMonth = "LW"
        resultDayOfWeek = "?"
        break
      case "lastSpecific":
        resultDayOfMonth = "?"
        resultDayOfWeek = `${lastSpecificDay}L`
        break
      case "daysBeforeEom":
        resultDayOfMonth = `L-${daysBeforeEom}`
        resultDayOfWeek = "?"
        break
      case "nthDay":
        resultDayOfMonth = "?"
        resultDayOfWeek = `${nthDay.nth}#${nthDay.dow}`
        break
      default:
        return
    }
    if (dayOfMonth !== resultDayOfMonth) setDayOfMonth(resultDayOfMonth)
    if (dayOfWeek !== resultDayOfWeek) setDayOfWeek(resultDayOfWeek)
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
    isSyncingFromProps,
  ])

  useEffect(() => {
    if (!dayOfMonth || !dayOfWeek) return
    setIsSyncingFromProps(true)
    const dayAllOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const dayAllOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString())

    if (dayOfMonth === "?" && dayOfWeek === "*") {
      setDayType("every")
    } else if (dayOfMonth === "?" && dayOfWeek.includes("/")) {
      setDowIncrementStart(dayOfWeek.split("/")[0])
      setDowIncrementStep(dayOfWeek.split("/")[1])
      setDayType("dowIncrement")
    } else if (dayOfMonth.includes("/") && dayOfWeek === "?") {
      setDomIncrementStart(dayOfMonth.split("/")[0])
      setDomIncrementStep(dayOfMonth.split("/")[1])
      setDayType("domIncrement")
    } else if (dayOfMonth === "?" && (dayAllOfWeek.includes(dayOfWeek) || dayOfWeek.includes(","))) {
      setSpecificDays(dayOfWeek.split(","))
      setDayType("dowSpecific")
    } else if ((dayAllOfMonth.includes(dayOfMonth) || dayOfMonth.includes(",")) && dayOfWeek === "?") {
      setSelectedDays(dayOfMonth.split(","))
      setDayType("domSpecific")
    } else if (dayOfMonth === "L" && dayOfWeek === "?") {
      setDayType("lastDay")
    } else if (dayOfMonth === "LW" && dayOfWeek === "?") {
      setDayType("lastWeekday")
    } else if (dayOfMonth === "?" && dayOfWeek.endsWith("L")) {
      setLastSpecificDay(dayOfWeek.substring(0, 1))
      setDayType("lastSpecific")
    } else if (dayOfMonth.includes("L-") && dayOfWeek === "?") {
      setDaysBeforeEom(dayOfMonth.split("-")[1])
      setDayType("daysBeforeEom")
    } else if (dayOfMonth === "?" && dayOfWeek.includes("#")) {
      setNthDay({ nth: dayOfWeek.split("#")[0], dow: dayOfWeek.split("#")[1] })
      setDayType("nthDay")
    }
    setTimeout(() => setIsSyncingFromProps(false), 0)
  }, [dayOfMonth, dayOfWeek])

  const dayAllOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const dayAllOfMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const dayAll = Constants.DAYS
  const suffixes = { 0: "st", 1: "nd", 2: "rd" }

  const handleSpecificDaysChange = (day) => {
    setSpecificDays((prev) => {
      const updatedDays = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      return updatedDays.sort((a, b) => dayAllOfWeek.indexOf(a) - dayAllOfWeek.indexOf(b))
    })
  }

  const handleDaySelection = (day) => {
    setSelectedDays((prev) => {
      const updatedDays = prev.includes(day.toString())
          ? prev.filter((d) => d !== day.toString())
          : [...prev, day.toString()]
      return updatedDays.sort((a, b) => a - b)
    })
  }

  return (
      <div className={styles.customTabPane} id="tabs-4" role="tabpanel">
        <div>
          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronEveryDay"
                name="cronDay"
                checked={dayType === "every"}
                onChange={() => setDayType("every")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronEveryDay">
              Every day
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronDowIncrement"
                name="cronDay"
                checked={dayType === "dowIncrement"}
                onChange={() => setDayType("dowIncrement")}
            />
            <label className={styles.labelSelect} htmlFor="cronDowIncrement">
              Every
            </label>
            <select
                value={dowIncrementStep}
                onChange={(e) => setDowIncrementStep(e.target.value)}
                className={styles.customSelectForm}
            >
              {Array.from({ length: 7 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronDowIncrement">
              day(s) starting on
            </label>
            <select
                value={dowIncrementStart}
                onChange={(e) => setDowIncrementStart(e.target.value)}
                className={styles.customSelectFormWide}
            >
              {dayAll.map((day, i) => (
                  <option key={i} value={i + 1}>
                    {day}
                  </option>
              ))}
            </select>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronDomIncrement"
                name="cronDay"
                checked={dayType === "domIncrement"}
                onChange={() => setDayType("domIncrement")}
            />
            <label className={styles.labelSelect} htmlFor="cronDomIncrement">
              Every
            </label>
            <select
                value={domIncrementStep}
                onChange={(e) => setDomIncrementStep(e.target.value)}
                className={styles.customSelectForm}
            >
              {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronDomIncrement">
              day(s) starting on
            </label>
            <select
                value={domIncrementStart}
                onChange={(e) => setDomIncrementStart(e.target.value)}
                className={styles.customSelectForm}
            >
              {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronDomIncrement">
              of the month
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronDowSpecific"
                name="cronDay"
                checked={dayType === "dowSpecific"}
                onChange={() => setDayType("dowSpecific")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronDowSpecific">
              Specific day(s) of the week
            </label>
            <div className={`${styles.customCheckboxCronjobWrapper} ${dayType === "dowSpecific" ? styles.show : ""}`}>
              <div className={styles.customCheckboxCronjob}>
                {dayAllOfWeek.map((day) => (
                    <div key={day} className={styles.customCol6p}>
                      <input
                          className={styles.customFormCheckInput}
                          type="checkbox"
                          value={day}
                          id={`cronDowSpecific${day}`}
                          checked={specificDays.includes(day)}
                          onChange={() => handleSpecificDaysChange(day)}
                      />
                      <label className={styles.customFormCheckLabel} htmlFor={`cronDowSpecific${day}`}>
                        {day}
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
                id="cronSpecificDays"
                name="cronDay"
                checked={dayType === "domSpecific"}
                onChange={() => setDayType("domSpecific")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronSpecificDays">
              Specific day(s) of the month
            </label>
            <div className={`${styles.customCheckboxCronjobWrapper} ${dayType === "domSpecific" ? styles.show : ""}`}>
              <div className={styles.customCheckboxCronjob}>
                {dayAllOfMonth.map((day, i) => (
                    <div key={i} className={styles.customCol6p}>
                      <input
                          className={styles.customFormCheckInput}
                          type="checkbox"
                          value={day}
                          id={`cronSpecificDays${i}`}
                          checked={selectedDays.includes(day.toString())}
                          onChange={() => handleDaySelection(day)}
                      />
                      <label className={styles.customFormCheckLabel} htmlFor={`cronSpecificDays${i}`}>
                        {day.toString().padStart(2, "0")}
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
                id="cronLastDay"
                name="cronDay"
                checked={dayType === "lastDay"}
                onChange={() => setDayType("lastDay")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronLastDay">
              Last day of the month
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronLastWeekday"
                name="cronDay"
                checked={dayType === "lastWeekday"}
                onChange={() => setDayType("lastWeekday")}
            />
            <label className={styles.customFormCheckLabel} htmlFor="cronLastWeekday">
              Last weekday of the month
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronLastSpecific"
                name="cronDay"
                checked={dayType === "lastSpecific"}
                onChange={() => setDayType("lastSpecific")}
            />
            <label className={styles.labelSelect} htmlFor="cronLastSpecific">
              On the last
            </label>
            <select
                value={lastSpecificDay}
                onChange={(e) => setLastSpecificDay(e.target.value)}
                className={styles.customSelectFormInline}
            >
              {dayAll.map((day, index) => (
                  <option key={index} value={index + 1}>
                    {day}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronLastSpecific">
              of the month
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronDaysBeforeEom"
                name="cronDay"
                checked={dayType === "daysBeforeEom"}
                onChange={() => setDayType("daysBeforeEom")}
            />
            <label className={styles.labelSelect} htmlFor="cronDaysBeforeEom">
              On the last
            </label>
            <select
                value={daysBeforeEom}
                onChange={(e) => setDaysBeforeEom(e.target.value)}
                className={styles.customSelectFormInline}
            >
              {[...Array(31).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} day(s)
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronDaysBeforeEom">
              before the end of the month
            </label>
          </div>

          <div className={styles.customFormCheck}>
            <input
                className={styles.customFormCheckInput}
                type="radio"
                id="cronNthDay"
                name="cronDay"
                checked={dayType === "nthDay"}
                onChange={() => setDayType("nthDay")}
            />
            <label className={styles.labelSelect} htmlFor="cronNthDay">
              On the
            </label>
            <select
                value={nthDay.nth}
                onChange={(e) => setNthDay({ ...nthDay, nth: e.target.value })}
                className={styles.customSelectFormInline}
            >
              {[...Array(5).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                    {suffixes[i] || "th"}
                  </option>
              ))}
            </select>
            <select
                value={nthDay.dow}
                onChange={(e) => setNthDay({ ...nthDay, dow: e.target.value })}
                className={styles.customSelectFormInline}
            >
              {dayAll.map((day, i) => (
                  <option key={i} value={i + 1}>
                    {day}
                  </option>
              ))}
            </select>
            <label className={styles.labelSelectIncrement} htmlFor="cronNthDay">
              Of the month
            </label>
          </div>
        </div>
      </div>
  )
}

export default DaysContent

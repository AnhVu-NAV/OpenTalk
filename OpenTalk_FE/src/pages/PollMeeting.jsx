import { useEffect, useState } from "react"
import styles from "./styles/module/PollMeeting.module.css"
import { FaQuestion } from "react-icons/fa"
import axios from "/src/api/axiosClient.jsx"
import { getAccessToken, getCurrentUser } from "../helper/auth.jsx"

const PollApp = (meeting) => {
    const [pollOption, setPollOption] = useState([])
    const [poll, setPoll] = useState(null)
    const [loading, setLoading] = useState(true)
    const [reload, setReload] = useState(false)
    const [error, setError] = useState(null)
    const [pollId, setPollId] = useState(null)
    const [vote, setVote] = useState(false)
    const [pollData, setPollData] = useState([])
    const [hasVoted, setHasVoted] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const totalVotes = pollData.reduce((sum, option) => sum + option.votes, 0)
    const meetingId = meeting.meeting.id

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                console.log(meeting)
                const response = await axios.get(`/poll/${meetingId}`, {
                    headers: { Authorization: `Bearer ${getAccessToken()}` },
                })
                setPoll(response.data)
                setPollId(response.data.id)
                console.log("Poll: " + response.data.id)
                setVote(true)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPoll()
    }, [meetingId])

    useEffect(() => {
        if (!pollId) {
            setPollOption([])
            return
        }
        const fetchTopicPolls = async () => {
            try {
                console.log("Poll: ")
                const response = await axios.get(`/topic-poll/${pollId}`, {
                    headers: { Authorization: `Bearer ${getAccessToken()}` },
                })
                setPollOption(response.data)
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTopicPolls()
    }, [pollId])

    useEffect(() => {
        if (!pollId) return
        async function fetchResults() {
            try {
                const { data } = await axios.get(`/topic-vote/result/${pollId}`, {
                    headers: { Authorization: `Bearer ${getAccessToken()}` },
                })
                const mapped = data.map((item) => ({
                    id: item.topicPollId,
                    votes: item.result,
                }))
                setPollData(mapped)
                setReload(false)
            } catch (err) {
                console.error("Lấy kết quả poll lỗi:", err)
            }
        }
        fetchResults()
    }, [vote, pollId])

    const fetchVote = async (topicPollid) => {
        try {
            await axios.post(
                `/topic-vote`,
                {
                    voter: getCurrentUser(),
                    topicPollId: topicPollid,
                },
                { headers: { Authorization: `Bearer ${getAccessToken()}` } },
            )
            setReload(true)
            fetchAvailableToVote()
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableToVote = async () => {
        try {
            console.log("Start checking------------------------------------")
            console.log("UserId: " + getCurrentUser().id)
            const response = await axios.get(
                `/topic-vote/check/`,
                {
                    params: {
                        userId: getCurrentUser().id,
                        pollId: pollId,
                    },
                },
                { headers: { Authorization: `Bearer ${getAccessToken()}` } },
            )
            console.log("Before: " + response.data)
            setHasVoted(response.data)
            console.log("After: " + hasVoted)
        } catch (err) {
            console.error("Đã có lỗi xảy ra")
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setReload(true)
    }, [reload])

    useEffect(() => {
        if (!pollId) {
            setHasVoted(true)
        }
        fetchAvailableToVote()
    }, [pollId])

    const handleVote = async (pollOption) => {
        if (!hasVoted) return

        await fetchVote(pollOption)

        setPollData((prev) =>
            prev.map((option) => (option.id === pollOption ? { ...option, votes: option.votes + 1 } : option)),
        )
        setHasVoted(false)
        setShowResults(true)
    }

    const getVotePercentage = (votes) => {
        return totalVotes > 0 ? (votes / totalVotes) * 100 : 0
    }

    const getVotesById = (id) => pollData.find((o) => o.id === id)?.votes ?? 0

    return (
        <div className={styles.pollContainer}>
            <div className={styles.pollWrapper}>
                <div className={styles.pollCard}>
                    <div className={styles.pollCardHeader}>
                        <div className={styles.pollUserInfo}>
                            <div className={styles.pollAvatar}>MJ</div>
                            <div className={styles.pollUserText}>
                                <span className={styles.pollUsername}>@Mariam Jahangiri</span>
                                <span className={styles.pollDescription}>created a poll: Which topic should we discuss?</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.pollContent}>
                        <div className={styles.pollQuestion}>
              <span className={styles.pollQuestionEmoji}>
                <FaQuestion />
              </span>
                            <h2 className={styles.pollQuestionText}>{`Voting discussion for ${meeting.meeting.meetingName}`}</h2>
                        </div>

                        <div className={styles.pollOptions}>
                            {pollOption.map((option) => (
                                <div key={option.id} className={styles.pollOption}>
                                    <div className={styles.pollOptionContent}>
                                        <div className={styles.pollOptionHeader}>
                                            <div className={styles.pollOptionLabel}>
                                                <span className={styles.pollOptionName}>{option.topic.title}</span>
                                            </div>
                                            {showResults && (
                                                <span className={styles.pollOptionVotes}>
                          {getVotesById(option.id)} {getVotesById(option.id) === 1 ? "vote" : "votes"}
                        </span>
                                            )}
                                        </div>
                                        {showResults && (
                                            <div className={styles.pollProgressBar}>
                                                <div
                                                    className={styles.pollProgressFill}
                                                    style={{ width: `${getVotePercentage(getVotesById(option.id))}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => handleVote(option.id)} disabled={!hasVoted} className={styles.pollVoteButton}>
                                        Vote
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <button onClick={() => setShowResults((prev) => !prev)} className={styles.pollShowResults}>
                                Show results
                            </button>
                        </div>

                        {showResults && <div className={styles.pollTotalVotes}>Total votes: {totalVotes}</div>}
                    </div>
                </div>

                <div className={styles.pollHistory}>
                    <div className={styles.pollHistoryIcon}>
                        <div className={styles.pollHistoryDot} />
                    </div>
                    <span>History is on</span>
                </div>
            </div>
        </div>
    )
}

export default PollApp

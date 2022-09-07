import "./score-keeper.css";

interface IScoreKeeperProps {
  numSuccess: number;
  numFail: number;
}

export const ScoreKeeper: React.FC<IScoreKeeperProps> = ({
  numFail,
  numSuccess,
}) => {
    const average = (numSuccess / (numSuccess + numFail));
    const displayAverage = isNaN(average) ? 0 : average;
  return (
    <div className="score-keeper-component card-wrapper">
      <h2 className="score-title">Stats</h2>
      <div className="stat-container">
        <div className="number-wrapper">
          <div className="score-display correct-container">
            <h2 className="success">{numSuccess}</h2>
            <h2 className="label-for-success">Correct</h2>
          </div>
          <div className="score-display incorrect-container">
            <h2 className="fail">{numFail}</h2>
            <h2 className="label-for-fail">Incorrect</h2>
          </div>
          <div className="score-display average-container">
            <h2 className="score-display average">
              {`${displayAverage}%`}
            </h2>
            <h2 className="label-for-average">Average</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

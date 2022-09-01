import "./score-keeper.css";

interface IScoreKeeperProps {
  numSuccess: number;
  numFail: number;
}

export const ScoreKeeper: React.FC<IScoreKeeperProps> = ({
  numFail,
  numSuccess,
}) => {
  return (
    <div className="score-keeper-component card-wrapper">
      <h2>Score</h2>
      <div className="number-wrapper">
      <h2 className="success">{numSuccess}</h2>
      <h2 className="fail">{numFail}</h2>
      </div>
    </div>
  );
};

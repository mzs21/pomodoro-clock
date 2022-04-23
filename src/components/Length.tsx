import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";

interface IProps {
  title: string;
  changeTime: (time: number, type: string) => void;
  type: string;
  time: number;
  formatTime: (time: number) => string;
}

const Length = ({ title, changeTime, type, time, formatTime }: IProps) => {
  return (
    <div className="space-y-4">
      <h3 className="time-length-title">{title}</h3>
      <div className="length-container">
        <ArrowDownIcon onClick={() => changeTime(-60, type)} />
        {formatTime(time)}
        <ArrowUpIcon onClick={() => changeTime(60, type)} />
      </div>
    </div>
  );
};

export default Length;

import { Chevron, ChevronDirection } from '../chevron/chevron';

export interface SortHeaderProps {
  text: string;
  direction: ChevronDirection;
  onSortClick: (args: any) => void;
  onSortArgs: any;
}

export const SortHeader = ({ text, direction, onSortClick, onSortArgs }: SortHeaderProps) => {
  return (
    <span className="clickable" onClick={() => onSortClick(onSortArgs)}>
      {text}
      <span className="chevron-sort">
        <Chevron direction={direction} />
      </span>
    </span>
  );
};

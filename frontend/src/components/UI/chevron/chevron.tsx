/* eslint-disable jsx-a11y/alt-text */

export type ChevronDirection = 'up' | 'down';

export interface ChevronProps {
  direction: ChevronDirection;
}

export const Chevron = ({ direction }: ChevronProps) => {
  return (
    <>
      <img src={`${process.env.PUBLIC_URL}/assets/chevron-${direction}.svg`} />
    </>
  );
};

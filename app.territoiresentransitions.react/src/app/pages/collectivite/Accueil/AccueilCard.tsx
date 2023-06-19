import classNames from 'classnames';

type AccueilCardProps = {
  children: React.ReactNode;
  className?: string;
};

const AccueilCard = ({children, className}: AccueilCardProps): JSX.Element => {
  return (
    <div
      className={classNames('h-full bg-white rounded-lg p-8', className)}
      style={{
        boxShadow: '0px 2px 16px 0px #0063CB0A, 0px 4px 6px 0px #0063CB0F',
      }}
    >
      {children}
    </div>
  );
};

export default AccueilCard;

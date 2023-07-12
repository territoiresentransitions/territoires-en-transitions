type KeyNumbersProps = {
  valuesList: {
    value: number;
    totalValue?: number;
    firstLegend: string;
    secondLegend?: string;
  }[];
};

const KeyNumbers = ({valuesList}: KeyNumbersProps): JSX.Element => {
  return (
    <div
      className={`grid md:grid-cols-${valuesList.length} md:divide-x md:divide-y-0 divide-x-0 divide-y divide-[#e5e5e5] m-auto md:mb-auto mb-8 md:pb-4 w-fit`}
    >
      {valuesList.map((v, index) => (
        <div
          key={index}
          className="px-4 md:py-0 py-8 md:first:pl-0 first:pt-0 md:last:pr-0 last:pb-0"
        >
          <div className="text-[#ff5655] text-4xl font-bold pb-2">
            {v.value}
            {!!v.totalValue && <span className="text-xl">/{v.totalValue}</span>}
          </div>
          <div className="text-sm">{v.firstLegend}</div>
          {!!v.secondLegend && <div className="text-sm">{v.secondLegend}</div>}
        </div>
      ))}
    </div>
  );
};

export default KeyNumbers;

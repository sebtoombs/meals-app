import tw from "tailwind.macro";
import styled from "styled-components/macro";
import Button from "../Button";
import { MdChevronLeft } from "react-icons/md";
import DaySelect from "../DaySelect";
import { addToCalendar } from "../../lib/api";

const AddMeal = props => {
  const { meal } = props;

  const handleDaySelect = day => {
    props.selectDay(day);
  };

  return (
    <div css={tw`p-4`}>
      <div css={tw`pb-4`}>
        <Button
          link
          icon={<MdChevronLeft />}
          onClick={() => props.selectMeal(null)}
          css={tw`ml-auto mr-0`}
        >
          Back
        </Button>
      </div>
      <div css={tw`flex mb-8`}>
        <div css={tw`w-20 h-20 rounded bg-gray-300`}></div>
        <div
          css={`
            flex-grow: 1;
            ${tw`px-3 py-2`}
          `}
        >
          <span css={tw`font-bold text-xl block`}>{meal.name}</span>
          <span css={tw`block`}>{meal.name_extra}</span>
        </div>
      </div>

      <DaySelect onChange={handleDaySelect} />
    </div>
  );
};
export default AddMeal;

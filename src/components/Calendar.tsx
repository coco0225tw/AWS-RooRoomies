import styled from 'styled-components';
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  // margin-top: 20px;
  background-color: #f3f2ef;
  padding: 10px;
  border-radius: 3px;
  /* ~~~ button styles ~~~ */
  button {
    background-color: #c77155;
    border: 0;
    color: #f3f2ef;
    border-radius: 50%;
    padding: 0px;
    height: 2rem;
    width: 2rem;
    // margin: 4px auto;
    margin: 4px auto;
    cursor: pointer;
    &:hover {
      background-color: white;
      border: 0;
      color: #fff7f4;
    }
    &:active {
      background-color: #fff7f4;
    }
  }
  // calendar style
  .react-calendar {
    width: 350px;
    max-width: 100%;
    background: white;
    border: 0px;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.125em;
  }
  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }
    .react-calendar__tile--range {
      // box-shadow: 0 0 2px 2px grey;
      background-color: white;
      color: #c77155;
      border: solid 2px #c77155;
    }
  }
  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    // color: white;
    // width: 2rem;
    // height: 3rem;
  }
  /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    margin: 3px;
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
      border-radius: 3px;
    }
    .react-calendar__navigation__arrow {
      // flex-grow: 0.333;
      border-radius: 3px;
    }
  }
  .react-calendar__navigation :enabled:focus {
    background-color: white;
    color: #c77155;
    border: solid 2px #c77155;
    border-radius: px;
  }
  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }
  /* ~~~ other view styles ~~~ */
  .react-calendar__year-view__months,
  .react-calendar__decade-view__years,
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;
    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      // max-width: initial !important;
      height: 2rem;
      width: 6rem;
      padding: 0rem;
    }
  }

  /* ~~~ disabled~~~ */
  .react-calendar__tile:disabled {
    background-color: #f3f2ef;
    color: gray;
  }
  .react-calendar__tile:enabled {
    // color: #fff7f4;
  }
  .react-calendar__tile:enabled:hover {
    background-color: white;
    color: #c77155;
    border: solid 2px #c77155;
  }
  ,
  .react-calendar__tile:enabled:focus {
    background-color: white;
    border: solid 2px #c77155;
    color: #c77155;
  }

  /* ~~ highlight ~~ */
  .highlight {
    color: red;
  }
`;

export default CalendarContainer;

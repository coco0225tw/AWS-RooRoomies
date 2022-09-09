import styled from 'styled-components';
const CalendarContainer = styled.div`
  /* ~~~ container styles ~~~ */
  //max-width: 600px;
  margin: auto;
  margin-top: 20px;
  background-color: #a8886b;
  padding: 10px;
  border-radius: 3px;

  /* ~~~ button styles ~~~ */
  button {
    background-color: #82542b;
    border: 0;
    color: white;
    border-radius: 50%;
    padding: 0px;
    height: 2rem;
    width: 2rem;
    // margin: 4px auto;
    margin: 4px auto;
    &:hover {
      background-color: white;
      color: black;
    }
    &:active {
      background-color: #82542b;
    }
  }
  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }
    .react-calendar__tile--range {
      box-shadow: 0 0 6px 2px black;
    }
  }
  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: white;
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
      max-width: initial !important;
    }
  }

  /* ~~~ disabled~~~ */
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
    color: gray;
  }
  .react-calendar__tile:enabled:hover {
    background-color: white;
    color: black;
    border: solid 1px #82542b;
  }
  ,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }

  /* ~~ highlight ~~ */
  .highlight {
    color: red;
  }
`;

export default CalendarContainer;

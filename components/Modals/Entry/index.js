import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

import Modal from "../index";

import List from "../../ModalAddToCalendar/List";
import AddMeal from "../../ModalAddToCalendar/Add";

import { addToCalendar } from "../../../lib/api";

export default function EntryModal(props) {
  const [selectedMeal, setSelectedMeal] = useState();

  const [selectedDay, setSelectedDay] = useState();

  const selectMeal = meal => {
    setSelectedMeal(meal);
  };

  const selectDay = date => {
    setSelectedDay(date);
  };

  const render = ({ openModal, closeModal, data }) => {
    if (data && data.day && !selectedDay) setSelectedDay(data.day);
    //else setSelectedDay(null);

    const handleAddToCalendar = async () => {
      closeModal();
      await addToCalendar(selectedMeal.id, selectedDay.date);
      mutate("calendar");
      toast.success(`${selectedMeal.name} added to ${selectedDay.name}`);
      //setSelectedDay(null);
      //setSelectedMeal(null);
    };

    useEffect(() => {
      if (selectedMeal && selectedDay) {
        handleAddToCalendar();
      }
    }, [selectedDay, selectedMeal]);

    if (selectedMeal)
      return (
        <AddMeal
          meal={selectedMeal}
          selectDay={selectDay}
          selectMeal={selectMeal}
          closeModal={closeModal}
        />
      );
    return <List selectMeal={selectMeal} closeModal={closeModal} />;
  };

  const onClose = () => {
    setSelectedDay(null);
    setSelectedMeal(null);
  };

  return (
    <Modal name="add_to_calendar" render={render} onClose={onClose}></Modal>
  );
}

import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";

import List from "./List";
import AddMeal from "./Add";

import modalService from "../../lib/modalService";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { addToCalendar } from "../../lib/api";

const customStyles = {
  content: {
    position: "absolute",
    //top: process.env.NODE_ENV === "production" ? 0 : "2.5rem",
    left: process.env.NODE_ENV === "production" ? 0 : "50%",
    right: process.env.NODE_ENV === "production" ? 0 : "auto",
    bottom: process.env.NODE_ENV === "production" ? 0 : "auto",
    borderRadius: 0,
    border: "none",
    background: "#f7fafc",
    maxWidth: process.env.NODE_ENV === "production" ? "100%" : "28rem",
    width: process.env.NODE_ENV === "production" ? "auto" : "100%",
    height: process.env.NODE_ENV === "production" ? "auto" : "812px",
    transform:
      process.env.NODE_ENV === "production" ? "none" : "translateX(-50%)"
  },
  overlay: {
    background: "none"
  }
};

function ModalAddToCalendar(props) {
  const [modalState, setModalState] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState();

  const [selectedDay, setSelectedDay] = useState();

  useEffect(() => {
    if (selectedMeal && selectedDay) {
      handleAddToCalendar();
    }
  }, [selectedDay, selectedMeal]);

  const handleCloseModal = () => {
    setModalState(false);
  };

  const handleShowModal = payload => {
    setModalState(true);
    if (payload && payload.day) {
      setSelectedDay(payload.day);
    }
  };

  useEffect(() => {
    modalService.on("modal::add_to_calendar::open", handleShowModal);
    return () => {
      modalService.off("modal::add_to_calendar::open", handleShowModal);
    };
  }, []);

  const handleAddToCalendar = async () => {
    handleCloseModal();
    await addToCalendar(selectedMeal.pk, selectedDay.date);
    mutate("calendar");
    toast.success(`${selectedMeal.name} added to ${selectedDay.name}`);
    setSelectedDay(null);
    setSelectedMeal(null);
  };

  const selectMeal = meal => {
    setSelectedMeal(meal);
  };

  const selectDay = date => {
    setSelectedDay(date);
  };

  const renderModalContent = () => {
    if (selectedMeal)
      return (
        <AddMeal
          meal={selectedMeal}
          selectDay={selectDay}
          selectMeal={selectMeal}
          closeModal={handleCloseModal}
        />
      );
    return <List selectMeal={selectMeal} closeModal={handleCloseModal} />;
  };

  return (
    <ReactModal
      isOpen={modalState}
      contentLabel="Add meal to calendar"
      style={customStyles}
      className="ModalDev"
    >
      {renderModalContent()}
    </ReactModal>
  );
}
export default ModalAddToCalendar;

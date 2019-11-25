import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";

import modalService from "../../lib/modalService";
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
    /*height: process.env.NODE_ENV === "production" ? "auto" : "812px",*/
    height: "100%",
    overflowY: "scroll",
    transform:
      process.env.NODE_ENV === "production" ? "none" : "translateX(-50%)"
  },
  overlay: {
    background: "none"
  }
};

function Modal(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
    if (typeof props.onClose === "function") props.onClose();
  };

  const openModal = payload => {
    setIsOpen(true);
    if (payload) {
      setModalData(payload);
    }
  };

  const modalName = props.name;

  useEffect(() => {
    modalService.on("modal::" + modalName + "::open", openModal);
    modalService.on("modal::" + modalName + "::close", closeModal);
    return () => {
      modalService.off("modal::" + modalName + "::open", openModal);
      modalService.off("modal::" + modalName + "::close", closeModal);
    };
  }, []);

  const modalProps = {
    closeModal,
    openModal,
    data: modalData
  };

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={props.contentLabel || ""}
      style={customStyles}
      className="ModalDev"
    >
      {props.render(modalProps)}
    </ReactModal>
  );
}
export default Modal;

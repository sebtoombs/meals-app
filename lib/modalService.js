import { EventEmitter } from "events";

const ModalService = () => {
  const emitter = new EventEmitter();

  return {
    on: (eventName, listener) => {
      emitter.on(eventName, listener);
    },
    off: (eventName, listener) => {
      emitter.removeListener(eventName, listener);
    },
    emit: (eventName, payload, error = false) => {
      emitter.emit(eventName, payload, error);
    },
    getEmitter: () => {
      return emitter;
    }
  };
};
const modalService = ModalService();
export default modalService;

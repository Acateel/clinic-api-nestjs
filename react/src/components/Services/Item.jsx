import * as Icons from "react-bootstrap-icons";
import styles from "./Services.module.scss";

const Item = ({ title, index }) => {
  return (
    <>
      <h3>{title}</h3>
      <p>
        World-class care for everyone. Our health System offers unmatched,
        expert health care. From the lab to the clinic.
      </p>
      <div className="d-flex">
        <a
          href="#"
          className="d-inline-flex p-2 border border-black border-2 rounded-circle me-auto text-reset"
        >
          <Icons.ArrowRight />
        </a>
        <span
          className={`${styles.badge} d-inline-flex justify-content-center align-items-center text-primary bg-primary bg-opacity-25`}
        >
          {index}
        </span>
      </div>
    </>
  );
};

export default Item;

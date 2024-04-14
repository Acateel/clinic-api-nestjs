import * as Icons from "react-bootstrap-icons";
import Image from "react-bootstrap/Image";
import styles from "./Doctor.module.scss";

const Doctor = () => {
  return (
    <div className={styles.wrapper}>
      <Image fluid src="doctor-img01.png" alt="doctor-1" />
      <h3 className="mt-3">Dr. Alfaz Ahmed</h3>
      <div className="d-flex justify-content-between mt-2">
        <span
          className={`${styles.badge} text-info-emphasis bg-info bg-opacity-25 fw-medium`}
        >
          surgeon
        </span>
        <div className="d-flex align-items-center">
          <Icons.StarFill className="text-warning me-1" />
          <span className="fw-medium">4.5</span>
          <span className="text-secondary">(2)</span>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <span>At Mount Adora Hospital, Sylhet</span>
        <a
          href="#"
          className="d-inline-flex p-2 border border-black border-2 rounded-circle ms-auto text-reset"
        >
          <Icons.ArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Doctor;

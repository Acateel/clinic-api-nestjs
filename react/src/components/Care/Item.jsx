import * as Icons from "react-bootstrap-icons";
import Image from "react-bootstrap/Image";

const Item = ({ title, img }) => {
  return (
    <>
      <Image src={img} alt="icon"></Image>
      <h3 className="mt-4">{title}</h3>
      <p>
        World-class care for everyone. Our health System offers unmatched,
        expert health care. From the lab to the clinic
      </p>
      <a
        href="#"
        className="d-inline-flex p-2 border border-black border-2 rounded-circle mx-auto text-reset"
      >
        <Icons.ArrowRight />
      </a>
    </>
  );
};

export default Item;

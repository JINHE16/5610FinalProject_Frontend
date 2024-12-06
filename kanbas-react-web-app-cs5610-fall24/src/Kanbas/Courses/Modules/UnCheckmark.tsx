import { RiProhibitedLine } from "react-icons/ri";
import { FaCircle } from "react-icons/fa";

export default function ProhibitedIcon() {
  return (
    <span className="me-1 position-relative">
      <RiProhibitedLine
        style={{ top: "2px" }}
        className="text-black me-1 position-absolute fs-5"
      />
      <FaCircle className="text-white me-1 fs-6" />
    </span>
  );
}

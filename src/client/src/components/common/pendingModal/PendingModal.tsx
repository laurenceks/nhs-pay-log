import { Modal } from "react-bootstrap";
import IconWrap from "../IconWrap";
import { IoSync } from "react-icons/io5";
import { toast } from "react-hot-toast";

const SettingsChangeLoadingModal = ({
    show,
    employmentName,
    employmentId,
}: {
    show: boolean;
    employmentName?: string;
    employmentId?: string | number;
}) => {
    return (
        <Modal
            show={show}
            fullscreen={"sm-down"}
            onExited={() => {
                console.log("done saving");
                toast.success(`${employmentName} updated`, {
                    id: `employment-${employmentId || 0}-updated`,
                });
            }}
        >
            <Modal.Header className="bg-warning text-dark">
                <Modal.Title>Applying changes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center align-items-center mx-auto mb-3 w-100">
                    <IconWrap width={"2.5rem"} className="spin">
                        <IoSync />
                    </IconWrap>
                </div>
                <p>
                    Recalculating shifts for{" "}
                    {employmentName || "this employment"}. For logs with a lot
                    of shifts this may take some time.
                </p>
            </Modal.Body>
        </Modal>
    );
};

export default SettingsChangeLoadingModal;

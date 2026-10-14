import SettingsEmployments from "./employment/SettingsEmployments";
import SettingsUser from "./employment/SettingsUser";

const Settings = () => {
    return (
        <div className="pb-3">
            <div className="pt-3 px-3">
                <h1>User settings</h1>
                <SettingsUser />
            </div>
            <SettingsEmployments />
        </div>
    );
};

export default Settings;

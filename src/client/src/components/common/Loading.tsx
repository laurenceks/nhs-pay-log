const Loading = ({ text }: { text?: string }) => {
    return (
        <div>
            <div className="loading-container py-5">
                <div className="px-5">
                    <div className="loading-dot-container">
                        <div className="loading-dot bg-dark-subtle" />
                    </div>
                </div>
            </div>
            {!!text && <p className="text-center mt-2 text-muted">{text}</p>}
        </div>
    );
};

export default Loading;

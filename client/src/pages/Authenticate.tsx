import React from 'react';
import StepEmail from '../components/steps/StepEmail';
import StepOtp from '../components/steps/StepOtp';

const steps = {
    1: StepEmail,
    2: StepOtp,
};

const Authenticate: React.FC = () => {

    const [step, setStep] = React.useState(1);
    // @ts-expect-error
    const Step = steps[step];

    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
            <Step onNext={() => setStep((prev) => prev + 1)} />
        </div>
    );
};

export default Authenticate;
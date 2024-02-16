import React from 'react';
import StepName from '../components/steps/StepName';
import StepAvatar from '../components/steps/StepAvatar';

const steps = {
    1: StepName,
    2: StepAvatar,
};

const Activate: React.FC = () => {

    const [step, setStep] = React.useState(1);
    // @ts-expect-error
    const Step = steps[step];

    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
            <Step onNext={() => setStep(step + 1)} />
        </div>
    );
};

export default Activate;
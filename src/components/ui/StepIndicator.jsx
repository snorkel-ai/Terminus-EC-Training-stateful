import './StepIndicator.css';

export function StepIndicator({ 
  steps = 1,
  currentStep = 0,
  onStepClick,
  className = '',
  ...props 
}) {
  const handleClick = (index) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <div className={`ui-step-indicators ${className}`} {...props}>
      {Array.from({ length: steps }, (_, index) => (
        <button
          key={index}
          type="button"
          className={[
            'ui-step-dot',
            index === currentStep && 'active',
            index < currentStep && 'completed'
          ].filter(Boolean).join(' ')}
          onClick={() => handleClick(index)}
          disabled={!onStepClick}
          aria-label={`Step ${index + 1} of ${steps}`}
          aria-current={index === currentStep ? 'step' : undefined}
        />
      ))}
    </div>
  );
}

export default StepIndicator;





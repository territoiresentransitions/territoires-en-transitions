import {cloneElement, useState} from 'react';
import {
  useFloating,
  offset,
  useInteractions,
  useDismiss,
  shift,
  useClick,
  FloatingPortal,
  FloatingFocusManager,
  Placement,
  autoUpdate,
  size,
} from '@floating-ui/react';

type DropdownFloaterProps = {
  children: JSX.Element;
  render: (data: {close: () => void}) => React.ReactNode;
  placement?: Placement;
  /** Toggle l'état d'ouverture avec des clics répétés sur le bouton d'ouverture. Défaut `true` */
  toggle?: boolean;
  /** Toggle l'état d'ouverture en appuyant sur la touche 'enter'. Défaut `true` */
  enterToToggle?: boolean;
  /** Pour que la largeur des options soit égale au bouton d'ouverture. Défaut `false` */
  containerWidthMatchButton?: boolean;
  /** Placement offset */
  offsetValue?: number;
  /** z-index */
  zIndex?: number;
  'data-test'?: string;
};

const DropdownFloater = ({
  render,
  children,
  placement,
  toggle = true,
  enterToToggle = true,
  containerWidthMatchButton = false,
  offsetValue = 4,
  zIndex = 1050,
  'data-test': dataTest,
}: DropdownFloaterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {x, y, strategy, reference, floating, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement ?? 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      shift(),
      size({
        apply({rects, elements, availableHeight}) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            overflowY: 'auto',
            minWidth: `${rects.reference.width}px`,
            width: containerWidthMatchButton
              ? `${rects.reference.width}px`
              : 'auto',
          });
        },
      }),
    ],
  });

  const click = useClick(context, {keyboardHandlers: false, toggle});
  const dismiss = useDismiss(context);

  const {getReferenceProps, getFloatingProps} = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({
          ref: reference,
          isOpen,
          onKeyDown(evt) {
            if (
              enterToToggle &&
              evt.key === 'Enter' &&
              evt.target instanceof HTMLInputElement
            ) {
              setIsOpen(!isOpen);
            }
          },
          ...children.props,
        })
      )}
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={-1}
          >
            <div
              data-test={dataTest}
              className="w-max bg-white shadow-md"
              {...getFloatingProps({
                ref: floating,
                style: {
                  position: strategy,
                  top: y ?? '',
                  left: x ?? '',
                  zIndex,
                },
              })}
            >
              {render({
                close: () => setIsOpen(false),
              })}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};

export default DropdownFloater;

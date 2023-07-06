import {cloneElement, ReactElement, useCallback, useState} from 'react';
import {
  Placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
  useClick,
} from '@floating-ui/react';
import DOMPurify from 'dompurify';
import classNames from 'classnames';

export type TTooltipProps = {
  /** libellé de l'infobulle (accepte du code HTML ou peut être une fonction de rendu) */
  label: string | (() => ReactElement);
  /** position à utiliser de préférence */
  placement?: Placement;
  /** élément auquel ajouter l'infobulle */
  children: JSX.Element;
  /** événement déclenchant l'affichage de l'info-bulle */
  activatedBy?: 'hover' | 'click';
  /** surcharge de la className sur l'infobulle */
  className?: string;
};

// les styles de l'infobulle
const tooltipClass =
  'pointer-events-none max-w-prose px-2 py-1 bg-[#19271D] text-white text-xs [&_*]:text-xs [&_*]:mb-0 z-[3001]';

/**
 * Affiche une info-bulle
 *
 * Copié/adapté depuis https://floating-ui.com/docs/react-dom-interactions#tooltip
 */
export const Tooltip = ({
  children,
  label,
  placement = 'bottom-start',
  activatedBy = 'hover',
  className,
}: TTooltipProps) => {
  const [open, setOpen] = useState(false);

  const {x, y, refs, strategy, context} = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({padding: 8})],
    whileElementsMounted: autoUpdate,
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    (activatedBy === 'click' ? useClick : useHover)(context, {
      delay: {open: 1000, close: 0},
    }),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useDismiss(context),
  ]);

  // Preserve the consumer's ref
  const ref = useMergedRefs([refs.setReference, children as never]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ref, ...children.props}))}
      {open && (
        <div
          ref={refs.setFloating}
          className={classNames(tooltipClass, className)}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          {...getFloatingProps()}
          dangerouslySetInnerHTML={
            typeof label === 'string'
              ? {__html: DOMPurify.sanitize(label)}
              : undefined
          }
        >
          {typeof label === 'function' ? label() : null}
        </div>
      )}
    </>
  );
};

// https://github.com/gregberge/react-merge-refs/issues/5#issuecomment-643341631
const useMergedRefs = (refs: Array<unknown>) =>
  useCallback(current => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(current);
      } else if (ref && !Object.isFrozen(ref)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:next-line
        ref.current = current;
      }
    });
  }, refs);

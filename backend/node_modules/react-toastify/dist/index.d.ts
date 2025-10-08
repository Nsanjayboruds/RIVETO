import * as React from 'react';
import React__default, { HTMLAttributes } from 'react';

interface CloseButtonProps {
    closeToast: CloseToastFunc;
    type: TypeOptions;
    ariaLabel?: string;
    theme: Theme;
}
declare function CloseButton({ closeToast, theme, ariaLabel }: CloseButtonProps): React__default.JSX.Element;

declare function ToastContainer(props: ToastContainerProps): React__default.JSX.Element;

declare const Bounce: ({ children, position, preventExitTransition, done, nodeRef, isIn, playToast }: ToastTransitionProps) => React.JSX.Element;
declare const Slide: ({ children, position, preventExitTransition, done, nodeRef, isIn, playToast }: ToastTransitionProps) => React.JSX.Element;
declare const Zoom: ({ children, position, preventExitTransition, done, nodeRef, isIn, playToast }: ToastTransitionProps) => React.JSX.Element;
declare const Flip: ({ children, position, preventExitTransition, done, nodeRef, isIn, playToast }: ToastTransitionProps) => React.JSX.Element;

/**
 * Used when providing custom icon
 */
interface IconProps {
    theme: Theme;
    type: TypeOptions;
    isLoading?: boolean;
}
type BuiltInIconProps = React__default.SVGProps<SVGSVGElement> & IconProps;
declare function Warning(props: BuiltInIconProps): React__default.JSX.Element;
declare function Info(props: BuiltInIconProps): React__default.JSX.Element;
declare function Success(props: BuiltInIconProps): React__default.JSX.Element;
declare function Error(props: BuiltInIconProps): React__default.JSX.Element;
declare function Spinner(): React__default.JSX.Element;
declare const Icons: {
    info: typeof Info;
    warning: typeof Warning;
    success: typeof Success;
    error: typeof Error;
    spinner: typeof Spinner;
};

declare function isToastActive(id: Id, containerId?: Id): boolean;
declare const clearWaitingQueue: (p?: ClearWaitingQueueParams) => void;

type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
type TypeOptions = 'info' | 'success' | 'warning' | 'error' | 'default';
type Theme = 'light' | 'dark' | 'colored' | (string & {});
type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
type CloseToastFunc = ((reason?: boolean | string) => void) & ((e: React__default.MouseEvent) => void);
interface ToastContentProps<Data = unknown> {
    closeToast: CloseToastFunc;
    toastProps: ToastProps;
    isPaused: boolean;
    data: Data;
}
type ToastContent<T = unknown> = React__default.ReactNode | ((props: ToastContentProps<T>) => React__default.ReactNode);
type ToastIcon = false | ((props: IconProps) => React__default.ReactNode) | React__default.ReactElement<IconProps>;
type Id = number | string;
type ToastTransition = React__default.FC<ToastTransitionProps> | React__default.ComponentClass<ToastTransitionProps>;
/**
 * ClassName for the elements - can take a function to build a classname or a raw string that is cx'ed to defaults
 */
type ToastClassName = ((context?: {
    type?: TypeOptions;
    defaultClassName?: string;
    position?: ToastPosition;
    rtl?: boolean;
}) => string) | string;
interface ClearWaitingQueueParams {
    containerId?: Id;
}
type DraggableDirection = 'x' | 'y';
interface CommonOptions {
    /**
     * Pause the timer when the mouse hover the toast.
     * `Default: true`
     */
    pauseOnHover?: boolean;
    /**
     * Pause the toast when the window loses focus.
     * `Default: true`
     */
    pauseOnFocusLoss?: boolean;
    /**
     * Remove the toast when clicked.
     * `Default: false`
     */
    closeOnClick?: boolean;
    /**
     * Set the delay in ms to close the toast automatically.
     * Use `false` to prevent the toast from closing.
     * `Default: 5000`
     */
    autoClose?: number | false;
    /**
     * Set the default position to use.
     * `One of: 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'`
     * `Default: 'top-right'`
     */
    position?: ToastPosition;
    /**
     * Pass a custom close button.
     * To remove the close button pass `false`
     */
    closeButton?: boolean | ((props: CloseButtonProps) => React__default.ReactNode) | React__default.ReactElement<CloseButtonProps>;
    /**
     * An optional css class to set for the progress bar.
     */
    progressClassName?: ToastClassName;
    /**
     * Hide or show the progress bar.
     * `Default: false`
     */
    hideProgressBar?: boolean;
    /**
     * Pass a custom transition see https://fkhadra.github.io/react-toastify/custom-animation/
     */
    transition?: ToastTransition;
    /**
     * Allow toast to be draggable
     * `Default: 'touch'`
     */
    draggable?: boolean | 'mouse' | 'touch';
    /**
     * The percentage of the toast's width it takes for a drag to dismiss a toast
     * `Default: 80`
     */
    draggablePercent?: number;
    /**
     * Specify in which direction should you swipe to dismiss the toast
     * `Default: "x"`
     */
    draggableDirection?: DraggableDirection;
    /**
     * Define the ARIA role for the toast
     * `Default: alert`
     *  https://www.w3.org/WAI/PF/aria/roles
     */
    role?: string;
    /**
     * Set id to handle multiple container
     */
    containerId?: Id;
    /**
     * Fired when clicking inside toaster
     */
    onClick?: (event: React__default.MouseEvent) => void;
    /**
     * Support right to left display.
     * `Default: false`
     */
    rtl?: boolean;
    /**
     * Used to display a custom icon. Set it to `false` to prevent
     * the icons from being displayed
     */
    icon?: ToastIcon;
    /**
     * Theme to use.
     * `One of: 'light', 'dark', 'colored'`
     * `Default: 'light'`
     */
    theme?: Theme;
    /**
     * When set to `true` the built-in progress bar won't be rendered at all. Autoclose delay won't have any effect as well
     * This is only used when you want to replace the progress bar with your own.
     *
     * See https://stackblitz.com/edit/react-toastify-custom-progress-bar?file=src%2FApp.tsx for an example.
     */
    customProgressBar?: boolean;
}
interface ToastOptions<Data = unknown> extends CommonOptions {
    /**
     * An optional css class to set.
     */
    className?: ToastClassName;
    /**
     * Called when toast is mounted.
     */
    onOpen?: () => void;
    /**
     * Called when toast is unmounted.
     * The callback first argument is the closure reason.
     * It is "true" when the notification is closed by a user action like clicking on the close button.
     */
    onClose?: (reason?: boolean | string) => void;
    /**
     * An optional inline style to apply.
     */
    style?: React__default.CSSProperties;
    /**
     * Set the toast type.
     * `One of: 'info', 'success', 'warning', 'error', 'default'`
     */
    type?: TypeOptions;
    /**
     * Set a custom `toastId`
     */
    toastId?: Id;
    /**
     * Used during update
     */
    updateId?: Id;
    /**
     * Set the percentage for the controlled progress bar. `Value must be between 0 and 1.`
     */
    progress?: number;
    /**
     * Let you provide any data, useful when you are using your own component
     */
    data?: Data;
    /**
     * Let you specify the aria-label
     */
    ariaLabel?: string;
    /**
     * Add a delay in ms before the toast appear.
     */
    delay?: number;
    isLoading?: boolean;
}
interface UpdateOptions<T = unknown> extends Nullable<ToastOptions<T>> {
    /**
     * Used to update a toast.
     * Pass any valid ReactNode(string, number, component)
     */
    render?: ToastContent<T>;
}
interface ToastContainerProps extends CommonOptions, Pick<HTMLAttributes<HTMLElement>, 'aria-label'> {
    /**
     * An optional css class to set.
     */
    className?: ToastClassName;
    /**
     * Will stack the toast with the newest on the top.
     */
    stacked?: boolean;
    /**
     * Whether or not to display the newest toast on top.
     * `Default: false`
     */
    newestOnTop?: boolean;
    /**
     * An optional inline style to apply.
     */
    style?: React__default.CSSProperties;
    /**
     * An optional inline style to apply for the toast.
     */
    toastStyle?: React__default.CSSProperties;
    /**
     * An optional css class for the toast.
     */
    toastClassName?: ToastClassName;
    /**
     * Limit the number of toast displayed at the same time
     */
    limit?: number;
    /**
     * Shortcut to focus the first notification with the keyboard
     * `default: Alt+t`
     *
     * ```
     * // focus when user presses ⌘ + F
     * const matchShortcut = (e: KeyboardEvent) => e.metaKey && e.key === 'f'
     * ```
     */
    hotKeys?: (e: KeyboardEvent) => boolean;
}
interface ToastTransitionProps {
    isIn: boolean;
    done: () => void;
    position: ToastPosition | string;
    preventExitTransition: boolean;
    nodeRef: React__default.RefObject<HTMLElement>;
    children?: React__default.ReactNode;
    playToast(): void;
}
/**
 * @INTERNAL
 */
interface ToastProps extends ToastOptions {
    isIn: boolean;
    staleId?: Id;
    toastId: Id;
    key: Id;
    transition: ToastTransition;
    closeToast: CloseToastFunc;
    position: ToastPosition;
    children?: ToastContent;
    draggablePercent: number;
    draggableDirection?: DraggableDirection;
    progressClassName?: ToastClassName;
    className?: ToastClassName;
    deleteToast: () => void;
    theme: Theme;
    type: TypeOptions;
    collapseAll: () => void;
    stacked?: boolean;
}
type ToastItemStatus = 'added' | 'removed' | 'updated';
interface ToastItem<Data = {}> {
    content: ToastContent<Data>;
    id: Id;
    theme?: Theme;
    type?: TypeOptions;
    isLoading?: boolean;
    containerId?: Id;
    data: Data;
    icon?: ToastIcon;
    status: ToastItemStatus;
    reason?: boolean | string;
}
type OnChangeCallback = (toast: ToastItem) => void;
type IdOpts = {
    id?: Id;
    containerId?: Id;
};
type ClearWaitingQueueFunc = typeof clearWaitingQueue;

declare const enum Default {
    COLLAPSE_DURATION = 300,
    DEBOUNCE_DURATION = 50,
    CSS_NAMESPACE = "Toastify",
    DRAGGABLE_PERCENT = 80,
    CONTAINER_ID = 1
}

interface CSSTransitionProps {
    /**
     * Css class to apply when toast enter
     */
    enter: string;
    /**
     * Css class to apply when toast leave
     */
    exit: string;
    /**
     * Append current toast position to the classname.
     * If multiple classes are provided, only the last one will get the position
     * For instance `myclass--top-center`...
     * `Default: false`
     */
    appendPosition?: boolean;
    /**
     * Collapse toast smoothly when exit animation end
     * `Default: true`
     */
    collapse?: boolean;
    /**
     * Collapse transition duration
     * `Default: 300`
     */
    collapseDuration?: number;
}
/**
 * Css animation that just work.
 * You could use animate.css for instance
 *
 *
 * ```
 * cssTransition({
 *   enter: "animate__animated animate__bounceIn",
 *   exit: "animate__animated animate__bounceOut"
 * })
 * ```
 *
 */
declare function cssTransition({ enter, exit, appendPosition, collapse, collapseDuration }: CSSTransitionProps): ({ children, position, preventExitTransition, done, nodeRef, isIn, playToast }: ToastTransitionProps) => React__default.JSX.Element;

/**
 * Used to collapse toast after exit animation
 */
declare function collapseToast(node: HTMLElement, done: () => void, duration?: Default): void;

declare function toast<TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>): Id;
declare namespace toast {
    var loading: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
    var promise: typeof handlePromise;
    var success: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
    var info: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
    var error: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
    var warning: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
    var warn: <TData = unknown>(content: ToastContent<TData>, options?: ToastOptions<TData>) => Id;
    var dark: (content: ToastContent, options?: ToastOptions) => Id;
    var dismiss: {
        (params: RemoveParams): void;
        (params?: Id): void;
    };
    var clearWaitingQueue: (p?: ClearWaitingQueueParams) => void;
    var isActive: typeof isToastActive;
    var update: <TData = unknown>(toastId: Id, options?: UpdateOptions<TData>) => void;
    var done: (id: Id) => void;
    var onChange: (cb: OnChangeCallback) => () => void;
    var play: (opts?: IdOpts) => void;
    var pause: (opts?: IdOpts) => void;
}
interface ToastPromiseParams<TData = unknown, TError = unknown, TPending = unknown> {
    pending?: string | UpdateOptions<TPending>;
    success?: string | UpdateOptions<TData>;
    error?: string | UpdateOptions<TError>;
}
declare function handlePromise<TData = unknown, TError = unknown, TPending = unknown>(promise: Promise<TData> | (() => Promise<TData>), { pending, error, success }: ToastPromiseParams<TData, TError, TPending>, options?: ToastOptions<TData>): Promise<TData>;
interface RemoveParams {
    id?: Id;
    containerId: Id;
}

export { Bounce, type ClearWaitingQueueFunc, type ClearWaitingQueueParams, CloseButton, type CloseButtonProps, type DraggableDirection, Flip, type IconProps, Icons, type Id, type OnChangeCallback, Slide, type Theme, type ToastClassName, ToastContainer, type ToastContainerProps, type ToastContent, type ToastContentProps, type ToastIcon, type ToastItem, type ToastOptions, type ToastPosition, type ToastPromiseParams, type ToastTransition, type ToastTransitionProps, type TypeOptions, type UpdateOptions, Zoom, collapseToast, cssTransition, toast };

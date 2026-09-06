/**
 * Lo sfondo: quattro livelli fissi dietro alla pagina più un velo di grana.
 * Qui sono vuoti di proposito — è ogni tema, in `src/app/themes/`, a dargli
 * gradienti, sfocature e movimento. Con lo stile originale restano invisibili.
 */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__layer" data-layer="1" />
      <div className="backdrop__layer" data-layer="2" />
      <div className="backdrop__layer" data-layer="3" />
      <div className="backdrop__layer" data-layer="4" />
      <div className="backdrop__grain" />
    </div>
  );
}

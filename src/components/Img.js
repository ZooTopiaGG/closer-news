import React from 'react'
const errorImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABlCAIAAABFiH99AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjVCQjAyRURGRkY0MTFFNjhGQzBBRUVGMkVBREQzQzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjVCQjAyRUVGRkY0MTFFNjhGQzBBRUVGMkVBREQzQzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NUJCMDJFQkZGRjQxMUU2OEZDMEFFRUYyRUFERDNDNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NUJCMDJFQ0ZGRjQxMUU2OEZDMEFFRUYyRUFERDNDNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmtLay4AAAKuSURBVHja7J3ZbsIwEEVJCBACD/z/b7KFvVcZNEIKuHtVT855QG5Y2nC49thxRbHdbkcQl5K3AMGAYEAwIBgQDAgGBCMYEAwIBgQDggHBgGAEA4IBwYBgQDAgGBAMCEYwIBgQDAgGBAOCAcEIBgQDggHB8AdUOf7Ru93up16qKIq6rq1xuVwOh0PiwU3TIDgzJpOJ1Fr7eDzSRYdCaqvq/hE/n8+32w3BoZhOp9aQ2tPpRJEV68zLcjwex47voAUPIb7DFazsKsHWDmw3VBUtZwql6iYlUvWw5jwfie/1elX/HHkkCmN3NpvZhEe3avv4mp4axY5vHMGeyMSR/tTo0oHgPGa07x65j0lVNZz4xhHcn+S8mvY8RtajjOD/Tn+V8dW6o6oqD64EJ4ZqBP8j7DqBpVa3ar8aXHXvfr/3e1VwHTui1tJx+ig5k7l0N67smtr1er1arUbdelbTNPpRx+W46iDB+SG1bdt6cNXwa46qtzWt8k+AHhYpzfEFa9BVj913prj7wcVi4Qtbj5oDLFAHFyxJsivHT+/dbDY+p1oul/3+XM/NfSpVBlarFKb1PHbUqrbm83l/2LbXyXc9JJpgVyK1H+lgHztqVVtPZ022uJ3ezUMV/esDrVDOXvXG6Rxb5WwvkvgVCP67GZEFS+h9t8YXz7+qrIQedXv54l32z1LwD+6O842S726pZAzOD82AVVt5fEOe46AFe3xVZ4XcMztowXVde80c+AscByq4KAqf9Qa+0jBcwbLra5PpSxQIzvCcy9L+H0k8XaZGcPa1le/aiVo8D1ew7b+0dtu2ma5PfaLa4BvASTAgGBAMCAYEA4IBwQgGBAOCAcGAYEAwIBjBgGBAMCAYEAwIBgQDghEMCAYEA4IBwYBgQDCCAcGAYEAwIBi+y5sAAwBsHID4T06+rAAAAABJRU5ErkJggg=='

/**
 * @description 新闻中的图片组件
 * @function Img
 */
export default props => {
  let _img = null;
  let _gif = null;
  const { url, clsname, width, height, gif } = props;

  function handleError() {
    _img.src = errorImg
  }

  function handleMouseEnter() {
    if (!gif) return;
    _img.src = gif
    _gif.classList.add('img-gif-ani');
  }

  if (url) {
    return (
      <div className={clsname}
        style={{
          width,
          height
        }}>
        <img className="img"
          ref={r => _img = r}
          src={url} 
          onError={handleError}/>
        <div className="img-mask"
          style={{
            width,
            height
          }}
          onMouseEnter={handleMouseEnter}>
        </div>
        { gif ? <span ref={r => _gif = r} className="img-gif">GIF</span> : null }
      </div>
    )
  } else {
    return null
  }
}

// monkey-patch react so it works with Ejecta

import ExecutionEnvironment from 'react/node_modules/fbjs/lib/ExecutionEnvironment';
import ReactMount from 'react/lib/ReactMount';

function noop() {};

ExecutionEnvironment.canUseDOM = false;
ReactMount._mountImageIntoNode = noop;
ReactMount._registerComponent = noop;

import { HtmlElement, Route, PureContainer } from 'cx/widgets';


import createLayout from 'shared/layout';

import Default from './default';
import Forms from 'shared/routes/forms';
import Grids from 'shared/routes/grids';
import Charts from 'shared/routes/charts';
import Blocks from 'shared/routes/blocks';
import Reset from 'shared/routes/reset';
import Overlays from 'shared/routes/overlays';

const layout = createLayout(<cx>
   <a href="..">Themes</a>
   <a href="#">Playground</a>
</cx>);

export default <cx>
   <PureContainer outerLayout={layout}>
      <Route route="#" url:bind="hash">
         <Default />
      </Route>
      <Route route="#reset" url:bind="hash">
         <Reset />
      </Route>
      <Route route="#forms" url:bind="hash">
         <Forms />
      </Route>
      <Route route="#grids" url:bind="hash">
         <Grids />
      </Route>

      <Route route="#charts" url:bind="hash">
         <Charts />
      </Route>

      <Route route="#blocks" url:bind="hash">
         <Blocks />
      </Route>

      <Route route="#overlays" url:bind="hash">
         <Overlays />
      </Route>

   </PureContainer>
</cx>



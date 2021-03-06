import {Widget, VDOM, getContent} from './Widget';
import {Instance} from './Instance';
import {RenderingContext} from './RenderingContext';
import {Debug, appDataFlag} from '../util/Debug';
import {Timing, appLoopFlag, vdomRenderFlag} from '../util/Timing';
import { isBatchingUpdates, batchUpdates } from './batchUpdates';

export class Cx extends VDOM.Component {
   constructor(props) {
      super(props);

      if (props.instance) {
         this.widget = props.instance.widget;
         this.store = props.instance.store;
      }
      else {
         this.widget = Widget.create(props.widget || props.items[0]);

         if (this.props.parentInstance) {
            this.parentInstance = this.props.parentInstance;
            this.store = this.parentInstance.store;
         }
         else {
            this.parentInstance = new Instance(this.widget, 0);
            this.store = props.store;
         }

         if (!this.store)
            throw new Error('Cx component requires store.');
      }

      if (this.props.subscribe)
         this.unsubscribe = this.store.subscribe(::this.update);

      this.flags = {};
   }

   render() {
      if (!this.widget)
         return null;

      let context = new RenderingContext(this.props.options);
      let instance = this.props.instance || this.parentInstance.getChild(this.context, this.widget, null, this.store);
      return <CxContext context={context} instance={instance} flags={this.flags}/>
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      if (this.flags.dirty) {
         this.update();
      }
   }

   update() {
      let data = this.store.getData();
      Debug.log(appDataFlag, data);
      if (this.flags.preparing)
         this.flags.dirty = true;
      else if (isBatchingUpdates()) {
         this.setState({data: data});
      } else {
         //batch sequential store commands
         if (!this.pendingUpdateTimer) {
            this.pendingUpdateTimer = setTimeout(() => {
               delete this.pendingUpdateTimer;
               this.setState({data: data});
            }, 0);
         }
      }
   }

   componentWillUnmount() {
      if (this.pendingUpdateTimer)
         clearTimeout(this.pendingUpdateTimer);
      if (this.unsubscribe)
         this.unsubscribe();
   }
}

Cx.prototype.subscribe = false;

class CxContext extends VDOM.Component {

   constructor(props) {
      super(props);
      this.componentWillReceiveProps(props);
      this.renderCount = 0;
   }

   componentWillReceiveProps(props) {
      this.timings = {
         start: Timing.now()
      };

      let {context, instance} = props;
      let count = 0, visible;

      this.props.flags.preparing = false;

      do {
         this.props.flags.dirty = false;
         visible = instance.explore(context);
      } while (visible && this.props.flags.dirty && count < 3 && Widget.optimizePrepare);

      if (visible) {
         this.timings.afterExplore = Timing.now();
         instance.prepare(context)
         this.timings.afterPrepare = Timing.now();

         let result = instance.render(context);
         this.content = getContent(result);
         this.timings.afterRender = Timing.now();
      }
      else {
         this.content = null;
         this.timings.afterExplore = this.timings.afterPrepare = this.timings.afterRender = Timing.now();
      }

      this.timings.beforeVDOMRender = Timing.now();
      this.props.flags.preparing = false;
      this.props.flags.rendering = true;
   }

   render() {
      return this.content;
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      this.props.flags.rendering = false;
      this.timings.afterVDOMRender = Timing.now();

      let {context, instance} = this.props;
      instance.cleanup(context);

      this.timings.afterCleanup = Timing.now();

      this.renderCount++;

      let { start, beforeVDOMRender, afterVDOMRender, afterPrepare, afterExplore, afterRender, afterCleanup } = this.timings;

      Timing.log(
         vdomRenderFlag,
         this.renderCount,
         'cx', (beforeVDOMRender - start + afterCleanup - afterVDOMRender).toFixed(2) + 'ms',
         'vdom', (afterVDOMRender - beforeVDOMRender).toFixed(2) + 'ms'
      );

      Timing.log(
         appLoopFlag,
         this.renderCount,
         context.options.name || 'main',
         'total', (afterCleanup - start).toFixed(1) + 'ms',
         'explore', (afterExplore - start).toFixed(1) + 'ms',
         'prepare', (afterPrepare - afterExplore).toFixed(1),
         'render', (afterRender - afterPrepare).toFixed(1),
         'vdom', (afterVDOMRender - beforeVDOMRender).toFixed(1),
         'cleanup', (afterCleanup - afterVDOMRender).toFixed(1)
      );
   }
}

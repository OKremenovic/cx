import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    to: {
        key: true,
        alias: 'value',
        type: 'number',
        description: <cx><Md>
            High value of the slider range.
        </Md></cx>
    },
    from: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Low value of the slider range.
        </Md></cx>
    },
    minValue: {
        key: true,
        alias: 'min',
        type: 'number',
        description: <cx><Md>
            Minimum allowed value. Default is `0`.
        </Md></cx>
    },
    maxValue: {
        key: true,
        alias: 'max',
        type: 'number',
        description: <cx><Md>
            Maximum allowed value. Default is `100`.
        </Md></cx>
    },
    step: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Rounding step.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `slider`.
        </Md></cx>
    },
    vertical: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to orient the slider vertically.
        </Md></cx>
    },
    handleStyle: {
        type: 'string/object',
        description: <cx><Md>
            Style object to be applied on the handle.
        </Md></cx>
    },
    rangeStyle: {
        type: 'string/object',
        description: <cx><Md>
            Style object to be applied on the selected axis range.
        </Md></cx>
    }
};
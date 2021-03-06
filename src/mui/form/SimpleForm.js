import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getDefaultValues from './getDefaultValues';
import FormField from './FormField';
import Toolbar from './Toolbar';

const formStyle = { padding: '0 1em 1em 1em' };

export class SimpleForm extends Component {
    handleSubmitWithRedirect = (redirect = this.props.redirect) => this.props.handleSubmit(values => this.props.save(values, redirect));

    render() {
        const { children, invalid, record, resource, basePath, submitOnEnter, toolbar } = this.props;
        return (
            <form className="simple-form">
                <div style={formStyle}>
                    {Children.map(children, input => input && (
                        <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                            <FormField input={input} resource={resource} record={record} basePath={basePath} />
                        </div>
                    ))}
                </div>
                {toolbar && React.cloneElement(toolbar, {
                    handleSubmitWithRedirect: this.handleSubmitWithRedirect,
                    invalid,
                    submitOnEnter,
                })}
            </form>
        );
    }
}

SimpleForm.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.node,
    defaultValue: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    handleSubmit: PropTypes.func, // passed by redux-form
    invalid: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    save: PropTypes.func, // the handler defined in the parent, which triggers the REST submission
    submitOnEnter: PropTypes.bool,
    toolbar: PropTypes.element,
    validate: PropTypes.func,
};

SimpleForm.defaultProps = {
    submitOnEnter: true,
    toolbar: <Toolbar />,
};

const enhance = compose(
    connect((state, props) => ({
        initialValues: getDefaultValues(state, props),
    })),
    reduxForm({
        form: 'record-form',
        enableReinitialize: true,
    }),
);

export default enhance(SimpleForm);

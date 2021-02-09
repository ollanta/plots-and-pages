
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Plotly.svelte generated by Svelte v3.32.2 */

    const file = "src/Plotly.svelte";

    function create_fragment(ctx) {
    	let script;
    	let script_src_value;
    	let t;
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			script = element("script");
    			t = space();
    			div = element("div");
    			if (script.src !== (script_src_value = "https://cdn.plot.ly/plotly-latest.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 17, 2, 279);
    			attr_dev(div, "id", "plotly-graph");
    			add_location(div, file, 20, 0, 387);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*scriptlyLoaded*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(script);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Plotly", slots, []);
    	let { data } = $$props;
    	let { layout } = $$props;
    	var initialized;

    	function scriptlyLoaded() {
    		Plotly.newPlot("plotly-graph", data, layout);
    		$$invalidate(3, initialized = true);
    	}

    	const writable_props = ["data", "layout"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Plotly> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("layout" in $$props) $$invalidate(2, layout = $$props.layout);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		layout,
    		initialized,
    		scriptlyLoaded
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("layout" in $$props) $$invalidate(2, layout = $$props.layout);
    		if ("initialized" in $$props) $$invalidate(3, initialized = $$props.initialized);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*initialized, data, layout*/ 14) {
    			if (initialized) {
    				Plotly.react("plotly-graph", data, layout);
    			}
    		}
    	};

    	return [scriptlyLoaded, data, layout, initialized];
    }

    class Plotly_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { data: 1, layout: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plotly_1",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Plotly> was created without expected prop 'data'");
    		}

    		if (/*layout*/ ctx[2] === undefined && !("layout" in props)) {
    			console.warn("<Plotly> was created without expected prop 'layout'");
    		}
    	}

    	get data() {
    		throw new Error("<Plotly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Plotly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		throw new Error("<Plotly>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layout(value) {
    		throw new Error("<Plotly>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Graph.svelte generated by Svelte v3.32.2 */

    const { Object: Object_1 } = globals;

    function create_fragment$1(ctx) {
    	let plotly;
    	let current;

    	plotly = new Plotly_1({
    			props: {
    				data: /*data*/ ctx[0],
    				layout: /*layout*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(plotly.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(plotly, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const plotly_changes = {};
    			if (dirty & /*data*/ 1) plotly_changes.data = /*data*/ ctx[0];
    			if (dirty & /*layout*/ 2) plotly_changes.layout = /*layout*/ ctx[1];
    			plotly.$set(plotly_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plotly.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plotly.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(plotly, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getLineData(observations) {
    	return {
    		lines: observations.map(function (tr) {
    			return {
    				type: "line",
    				xref: "x",
    				yref: "paper",
    				x0: tr.time,
    				x1: tr.time,
    				y0: 0,
    				y1: 1,
    				line: { width: 2, dash: "dash" }
    			};
    		}),
    		times: observations.map(function (tr) {
    			return tr.time;
    		}),
    		names: observations.map(function (tr) {
    			return tr.name;
    		})
    	};
    }

    function getRectData(treatments) {
    	var colors = ["blue", "red", "green"];
    	var colorMap = {};

    	treatments.forEach(function (value) {
    		if (!colorMap[value.name]) {
    			colorMap[value.name] = colors.pop();
    		}

    		value.color = colorMap[value.name];
    	});

    	return {
    		rects: treatments.map(function (tr) {
    			return {
    				type: "rect",
    				xref: "x",
    				yref: "paper",
    				x0: tr.start,
    				x1: tr.end,
    				y0: 0,
    				y1: 0.1,
    				line: { width: 0 },
    				fillcolor: tr.color,
    				opacity: 0.3
    			};
    		}),
    		colorMap
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Graph", slots, []);
    	let { ddPCR } = $$props;
    	let { LD } = $$props;
    	let { Observations } = $$props;
    	let { Treatments } = $$props;
    	var data;
    	var layout;
    	const writable_props = ["ddPCR", "LD", "Observations", "Treatments"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Graph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("ddPCR" in $$props) $$invalidate(3, ddPCR = $$props.ddPCR);
    		if ("LD" in $$props) $$invalidate(2, LD = $$props.LD);
    		if ("Observations" in $$props) $$invalidate(4, Observations = $$props.Observations);
    		if ("Treatments" in $$props) $$invalidate(5, Treatments = $$props.Treatments);
    	};

    	$$self.$capture_state = () => ({
    		Plotly: Plotly_1,
    		ddPCR,
    		LD,
    		Observations,
    		Treatments,
    		data,
    		colorMap,
    		colorMapDummies,
    		layout,
    		lineData,
    		rects,
    		getLineData,
    		getRectData
    	});

    	$$self.$inject_state = $$props => {
    		if ("ddPCR" in $$props) $$invalidate(3, ddPCR = $$props.ddPCR);
    		if ("LD" in $$props) $$invalidate(2, LD = $$props.LD);
    		if ("Observations" in $$props) $$invalidate(4, Observations = $$props.Observations);
    		if ("Treatments" in $$props) $$invalidate(5, Treatments = $$props.Treatments);
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("colorMap" in $$props) $$invalidate(6, colorMap = $$props.colorMap);
    		if ("colorMapDummies" in $$props) $$invalidate(7, colorMapDummies = $$props.colorMapDummies);
    		if ("layout" in $$props) $$invalidate(1, layout = $$props.layout);
    		if ("lineData" in $$props) $$invalidate(8, lineData = $$props.lineData);
    		if ("rects" in $$props) $$invalidate(9, rects = $$props.rects);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*Treatments, ddPCR, LD*/ 44) {
    			{
    				$$invalidate(2, LD["yaxis"] = "y2", LD);
    				var colorMap = getRectData(Treatments).colorMap;

    				var colorMapDummies = Object.keys(colorMap).map(function (k) {
    					return {
    						x: ddPCR.x,
    						y: ddPCR.y,
    						showlegend: true,
    						visible: "legendonly",
    						opacity: 0.8,
    						mode: "markers",
    						marker: {
    							color: colorMap[k],
    							symbol: "square",
    							size: 15
    						},
    						name: k
    					};
    				});

    				$$invalidate(0, data = [
    					ddPCR,
    					LD,
    					{
    						// Dummy to force xaxis2 to show
    						x: ddPCR.x,
    						y: ddPCR.y,
    						xaxis: "x2",
    						showlegend: false,
    						opacity: 0
    					}
    				].concat(colorMapDummies));
    			}
    		}

    		if ($$self.$$.dirty & /*Observations, Treatments*/ 48) {
    			{
    				var lineData = getLineData(Observations);
    				var rects = getRectData(Treatments).rects;

    				$$invalidate(1, layout = {
    					xaxis: { side: "top", tickformat: "%Y-%m-%d" },
    					xaxis2: {
    						side: "bottom",
    						overlaying: "x",
    						matches: "x",
    						tickvals: lineData.times,
    						ticktext: lineData.names,
    						showgrid: false,
    						tickangle: 90
    					},
    					yaxis: {
    						title: "Värde - ddPCR",
    						rangemode: "tozero"
    					},
    					yaxis2: {
    						title: "Värde - LD",
    						side: "right",
    						overlaying: "y",
    						rangemode: "tozero"
    					},
    					legend: { itemclick: false, itemdoubleclick: false },
    					shapes: lineData.lines.concat(rects)
    				});
    			}
    		}
    	};

    	return [data, layout, LD, ddPCR, Observations, Treatments];
    }

    class Graph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			ddPCR: 3,
    			LD: 2,
    			Observations: 4,
    			Treatments: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graph",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ddPCR*/ ctx[3] === undefined && !("ddPCR" in props)) {
    			console.warn("<Graph> was created without expected prop 'ddPCR'");
    		}

    		if (/*LD*/ ctx[2] === undefined && !("LD" in props)) {
    			console.warn("<Graph> was created without expected prop 'LD'");
    		}

    		if (/*Observations*/ ctx[4] === undefined && !("Observations" in props)) {
    			console.warn("<Graph> was created without expected prop 'Observations'");
    		}

    		if (/*Treatments*/ ctx[5] === undefined && !("Treatments" in props)) {
    			console.warn("<Graph> was created without expected prop 'Treatments'");
    		}
    	}

    	get ddPCR() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ddPCR(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get LD() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set LD(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Observations() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Observations(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Treatments() {
    		throw new Error("<Graph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Treatments(value) {
    		throw new Error("<Graph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Table.svelte generated by Svelte v3.32.2 */

    const file$1 = "src/Table.svelte";

    function create_fragment$2(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			add_location(textarea, file$1, 11, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*text*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) {
    				set_input_value(textarea, /*text*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, []);
    	let { table = [] } = $$props;

    	var text = table.map(function (row) {
    		return row.join(",");
    	}).join("\n");

    	const writable_props = ["table"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$$set = $$props => {
    		if ("table" in $$props) $$invalidate(1, table = $$props.table);
    	};

    	$$self.$capture_state = () => ({ table, text, rows });

    	$$self.$inject_state = $$props => {
    		if ("table" in $$props) $$invalidate(1, table = $$props.table);
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("rows" in $$props) $$invalidate(3, rows = $$props.rows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 1) {
    			{
    				var rows = text.trim().split("\n");

    				$$invalidate(1, table = rows.map(function (row) {
    					return row.split(",");
    				}));
    			}
    		}
    	};

    	return [text, table, textarea_input_handler];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { table: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get table() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set table(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PlotTable.svelte generated by Svelte v3.32.2 */
    const file$2 = "src/PlotTable.svelte";

    function create_fragment$3(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let table;
    	let updating_table;
    	let current;

    	function table_table_binding(value) {
    		/*table_table_binding*/ ctx[3](value);
    	}

    	let table_props = {};

    	if (/*rawTable*/ ctx[1] !== void 0) {
    		table_props.table = /*rawTable*/ ctx[1];
    	}

    	table = new Table({ props: table_props, $$inline: true });
    	binding_callbacks.push(() => bind(table, "table", table_table_binding));

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			create_component(table.$$.fragment);
    			add_location(h3, file$2, 31, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			const table_changes = {};

    			if (!updating_table && dirty & /*rawTable*/ 2) {
    				updating_table = true;
    				table_changes.table = /*rawTable*/ ctx[1];
    				add_flush_callback(() => updating_table = false);
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PlotTable", slots, []);
    	let { name } = $$props;
    	let { data } = $$props;

    	let rawTable = data.x.map(function (v, i) {
    		return [v, data.y[i]];
    	});

    	function transformScatter(rawtable) {
    		var data = { x: [], y: [], name };

    		rawtable.forEach(function (rawrow) {
    			if (rawrow.length >= 2) {
    				data.x.push(rawrow[0]);
    				data.y.push(Number(rawrow[1]));
    			}
    		});

    		return data;
    	}

    	const writable_props = ["name", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PlotTable> was created with unknown prop '${key}'`);
    	});

    	function table_table_binding(value) {
    		rawTable = value;
    		$$invalidate(1, rawTable);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		name,
    		data,
    		rawTable,
    		transformScatter
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("rawTable" in $$props) $$invalidate(1, rawTable = $$props.rawTable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rawTable*/ 2) {
    			$$invalidate(2, data = transformScatter(rawTable));
    		}
    	};

    	return [name, rawTable, data, table_table_binding];
    }

    class PlotTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { name: 0, data: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlotTable",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console.warn("<PlotTable> was created without expected prop 'name'");
    		}

    		if (/*data*/ ctx[2] === undefined && !("data" in props)) {
    			console.warn("<PlotTable> was created without expected prop 'data'");
    		}
    	}

    	get name() {
    		throw new Error("<PlotTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<PlotTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<PlotTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<PlotTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/StopTable.svelte generated by Svelte v3.32.2 */

    const { console: console_1 } = globals;
    const file$3 = "src/StopTable.svelte";

    function create_fragment$4(ctx) {
    	let h3;
    	let t0;
    	let t1;
    	let table;
    	let updating_table;
    	let current;

    	function table_table_binding(value) {
    		/*table_table_binding*/ ctx[4](value);
    	}

    	let table_props = {};

    	if (/*rawTable*/ ctx[1] !== void 0) {
    		table_props.table = /*rawTable*/ ctx[1];
    	}

    	table = new Table({ props: table_props, $$inline: true });
    	binding_callbacks.push(() => bind(table, "table", table_table_binding));

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text(/*name*/ ctx[0]);
    			t1 = space();
    			create_component(table.$$.fragment);
    			add_location(h3, file$3, 35, 0, 632);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t0, /*name*/ ctx[0]);
    			const table_changes = {};

    			if (!updating_table && dirty & /*rawTable*/ 2) {
    				updating_table = true;
    				table_changes.table = /*rawTable*/ ctx[1];
    				add_flush_callback(() => updating_table = false);
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StopTable", slots, []);
    	let { name } = $$props;
    	let { data } = $$props;
    	let { keys } = $$props;

    	let rawTable = data.map(function (v) {
    		return keys.map(function (k) {
    			return v[k];
    		});
    	});

    	console.log(keys);
    	console.log(rawTable);

    	function transformStops(rawtable) {
    		var newdata = [];

    		rawtable.forEach(function (rawrow) {
    			if (rawrow.length == keys.length) {
    				var item = {};

    				rawrow.forEach(function (v, i) {
    					item[keys[i]] = v;
    				});

    				newdata.push(item);
    			}
    		});

    		return newdata;
    	}

    	const writable_props = ["name", "data", "keys"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<StopTable> was created with unknown prop '${key}'`);
    	});

    	function table_table_binding(value) {
    		rawTable = value;
    		$$invalidate(1, rawTable);
    	}

    	$$self.$$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("keys" in $$props) $$invalidate(3, keys = $$props.keys);
    	};

    	$$self.$capture_state = () => ({
    		Table,
    		name,
    		data,
    		keys,
    		rawTable,
    		transformStops
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("keys" in $$props) $$invalidate(3, keys = $$props.keys);
    		if ("rawTable" in $$props) $$invalidate(1, rawTable = $$props.rawTable);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rawTable*/ 2) {
    			$$invalidate(2, data = transformStops(rawTable));
    		}
    	};

    	return [name, rawTable, data, keys, table_table_binding];
    }

    class StopTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { name: 0, data: 2, keys: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StopTable",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !("name" in props)) {
    			console_1.warn("<StopTable> was created without expected prop 'name'");
    		}

    		if (/*data*/ ctx[2] === undefined && !("data" in props)) {
    			console_1.warn("<StopTable> was created without expected prop 'data'");
    		}

    		if (/*keys*/ ctx[3] === undefined && !("keys" in props)) {
    			console_1.warn("<StopTable> was created without expected prop 'keys'");
    		}
    	}

    	get name() {
    		throw new Error("<StopTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<StopTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<StopTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<StopTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keys() {
    		throw new Error("<StopTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keys(value) {
    		throw new Error("<StopTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.2 */
    const file$4 = "src/App.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let plottable0;
    	let updating_data;
    	let t0;
    	let plottable1;
    	let updating_data_1;
    	let t1;
    	let stoptable0;
    	let updating_data_2;
    	let t2;
    	let stoptable1;
    	let updating_data_3;
    	let t3;
    	let div1;
    	let graph;
    	let current;

    	function plottable0_data_binding(value) {
    		/*plottable0_data_binding*/ ctx[4](value);
    	}

    	let plottable0_props = { name: "ddPCR" };

    	if (/*ddPCR*/ ctx[0] !== void 0) {
    		plottable0_props.data = /*ddPCR*/ ctx[0];
    	}

    	plottable0 = new PlotTable({ props: plottable0_props, $$inline: true });
    	binding_callbacks.push(() => bind(plottable0, "data", plottable0_data_binding));

    	function plottable1_data_binding(value) {
    		/*plottable1_data_binding*/ ctx[5](value);
    	}

    	let plottable1_props = { name: "LD" };

    	if (/*LD*/ ctx[1] !== void 0) {
    		plottable1_props.data = /*LD*/ ctx[1];
    	}

    	plottable1 = new PlotTable({ props: plottable1_props, $$inline: true });
    	binding_callbacks.push(() => bind(plottable1, "data", plottable1_data_binding));

    	function stoptable0_data_binding(value) {
    		/*stoptable0_data_binding*/ ctx[6](value);
    	}

    	let stoptable0_props = {
    		name: "Observations",
    		keys: ["name", "time"]
    	};

    	if (/*Observations*/ ctx[2] !== void 0) {
    		stoptable0_props.data = /*Observations*/ ctx[2];
    	}

    	stoptable0 = new StopTable({ props: stoptable0_props, $$inline: true });
    	binding_callbacks.push(() => bind(stoptable0, "data", stoptable0_data_binding));

    	function stoptable1_data_binding(value) {
    		/*stoptable1_data_binding*/ ctx[7](value);
    	}

    	let stoptable1_props = {
    		name: "Treatments",
    		keys: ["name", "start", "end"]
    	};

    	if (/*Treatments*/ ctx[3] !== void 0) {
    		stoptable1_props.data = /*Treatments*/ ctx[3];
    	}

    	stoptable1 = new StopTable({ props: stoptable1_props, $$inline: true });
    	binding_callbacks.push(() => bind(stoptable1, "data", stoptable1_data_binding));

    	graph = new Graph({
    			props: {
    				ddPCR: /*ddPCR*/ ctx[0],
    				LD: /*LD*/ ctx[1],
    				Observations: /*Observations*/ ctx[2],
    				Treatments: /*Treatments*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(plottable0.$$.fragment);
    			t0 = space();
    			create_component(plottable1.$$.fragment);
    			t1 = space();
    			create_component(stoptable0.$$.fragment);
    			t2 = space();
    			create_component(stoptable1.$$.fragment);
    			t3 = space();
    			div1 = element("div");
    			create_component(graph.$$.fragment);
    			set_style(div0, "display", "flex");
    			set_style(div0, "flex-direction", "column");
    			set_style(div0, "flex", "20%");
    			add_location(div0, file$4, 28, 2, 659);
    			set_style(div1, "flex", "70%");
    			add_location(div1, file$4, 35, 2, 1005);
    			set_style(div2, "display", "flex");
    			add_location(div2, file$4, 27, 0, 628);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(plottable0, div0, null);
    			append_dev(div0, t0);
    			mount_component(plottable1, div0, null);
    			append_dev(div0, t1);
    			mount_component(stoptable0, div0, null);
    			append_dev(div0, t2);
    			mount_component(stoptable1, div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			mount_component(graph, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const plottable0_changes = {};

    			if (!updating_data && dirty & /*ddPCR*/ 1) {
    				updating_data = true;
    				plottable0_changes.data = /*ddPCR*/ ctx[0];
    				add_flush_callback(() => updating_data = false);
    			}

    			plottable0.$set(plottable0_changes);
    			const plottable1_changes = {};

    			if (!updating_data_1 && dirty & /*LD*/ 2) {
    				updating_data_1 = true;
    				plottable1_changes.data = /*LD*/ ctx[1];
    				add_flush_callback(() => updating_data_1 = false);
    			}

    			plottable1.$set(plottable1_changes);
    			const stoptable0_changes = {};

    			if (!updating_data_2 && dirty & /*Observations*/ 4) {
    				updating_data_2 = true;
    				stoptable0_changes.data = /*Observations*/ ctx[2];
    				add_flush_callback(() => updating_data_2 = false);
    			}

    			stoptable0.$set(stoptable0_changes);
    			const stoptable1_changes = {};

    			if (!updating_data_3 && dirty & /*Treatments*/ 8) {
    				updating_data_3 = true;
    				stoptable1_changes.data = /*Treatments*/ ctx[3];
    				add_flush_callback(() => updating_data_3 = false);
    			}

    			stoptable1.$set(stoptable1_changes);
    			const graph_changes = {};
    			if (dirty & /*ddPCR*/ 1) graph_changes.ddPCR = /*ddPCR*/ ctx[0];
    			if (dirty & /*LD*/ 2) graph_changes.LD = /*LD*/ ctx[1];
    			if (dirty & /*Observations*/ 4) graph_changes.Observations = /*Observations*/ ctx[2];
    			if (dirty & /*Treatments*/ 8) graph_changes.Treatments = /*Treatments*/ ctx[3];
    			graph.$set(graph_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plottable0.$$.fragment, local);
    			transition_in(plottable1.$$.fragment, local);
    			transition_in(stoptable0.$$.fragment, local);
    			transition_in(stoptable1.$$.fragment, local);
    			transition_in(graph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plottable0.$$.fragment, local);
    			transition_out(plottable1.$$.fragment, local);
    			transition_out(stoptable0.$$.fragment, local);
    			transition_out(stoptable1.$$.fragment, local);
    			transition_out(graph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(plottable0);
    			destroy_component(plottable1);
    			destroy_component(stoptable0);
    			destroy_component(stoptable1);
    			destroy_component(graph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	var ddPCR = {
    		x: ["2020-01-01", "2020-01-15", "2020-01-28"],
    		y: [1, 5, 6]
    	};

    	var LD = {
    		x: ["2020-01-01", "2020-01-15", "2020-02-01"],
    		y: [2, 7, 5]
    	};

    	var Observations = [{ name: "A", time: "2020-01-03" }, { name: "B", time: "2020-01-18" }];

    	var Treatments = [
    		{
    			name: "Taf",
    			start: "2020-01-05",
    			end: "2020-01-14"
    		},
    		{
    			name: "Taf+Mek",
    			start: "2020-01-14",
    			end: "2020-01-20"
    		},
    		{
    			name: "Taf",
    			start: "2020-01-20",
    			end: "2020-02-02"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function plottable0_data_binding(value) {
    		ddPCR = value;
    		$$invalidate(0, ddPCR);
    	}

    	function plottable1_data_binding(value) {
    		LD = value;
    		$$invalidate(1, LD);
    	}

    	function stoptable0_data_binding(value) {
    		Observations = value;
    		$$invalidate(2, Observations);
    	}

    	function stoptable1_data_binding(value) {
    		Treatments = value;
    		$$invalidate(3, Treatments);
    	}

    	$$self.$capture_state = () => ({
    		Graph,
    		PlotTable,
    		StopTable,
    		ddPCR,
    		LD,
    		Observations,
    		Treatments
    	});

    	$$self.$inject_state = $$props => {
    		if ("ddPCR" in $$props) $$invalidate(0, ddPCR = $$props.ddPCR);
    		if ("LD" in $$props) $$invalidate(1, LD = $$props.LD);
    		if ("Observations" in $$props) $$invalidate(2, Observations = $$props.Observations);
    		if ("Treatments" in $$props) $$invalidate(3, Treatments = $$props.Treatments);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ddPCR,
    		LD,
    		Observations,
    		Treatments,
    		plottable0_data_binding,
    		plottable1_data_binding,
    		stoptable0_data_binding,
    		stoptable1_data_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

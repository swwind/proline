module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'eslint:recommended',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  rules: {
    "accessor-pairs": "error",
    "array-bracket-newline": "off",
    "array-bracket-spacing": "off",
    "array-callback-return": "error",
    "array-element-newline": "off",
    "arrow-body-style": "off",
    "arrow-parens": [
      "error",
      "always"
    ],
    "arrow-spacing": [
      "error",
      {
        "after": true,
        "before": true
      }
    ],
    "block-scoped-var": "error",
    "block-spacing": "error",
    "brace-style": [
      "error",
      "1tbs"
    ],
    "callback-return": "error",
    "camelcase": "error",
    "capitalized-comments": "off",
    "class-methods-use-this": "error",
    "comma-dangle": "error",
    "comma-spacing": [
      "error",
      {
        "after": true,
        "before": false
      }
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "complexity": "error",
    "computed-property-spacing": [
      "error",
      "never"
    ],
    "consistent-return": "error",
    "consistent-this": "error",
    "curly": "error",
    "default-case": "error",
    "dot-location": [
      "error",
      "property"
    ],
    "dot-notation": "error",
    "eol-last": "error",
    "eqeqeq": "off",
    "func-call-spacing": "error",
    "func-name-matching": "error",
    "func-names": "error",
    "func-style": "off",
    "function-paren-newline": "error",
    "generator-star-spacing": "error",
    "global-require": "off",
    "guard-for-in": "error",
    "handle-callback-err": "error",
    "id-blacklist": "error",
    "id-length": "off",
    "id-match": "error",
    "implicit-arrow-linebreak": [
      "error",
      "beside"
    ],
    "indent": ["error", 2],
    "indent-legacy": "off",
    "init-declarations": "off",
    "jsx-quotes": "error",
    "key-spacing": "error",
    "keyword-spacing": [
      "error",
      {
        "after": true,
        "before": true
      }
    ],
    "line-comment-position": "off",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "lines-around-comment": "error",
    "lines-around-directive": "error",
    "lines-between-class-members": "error",
    "max-classes-per-file": "off",
    "max-depth": "error",
    "max-len": "off",
    "max-lines": "error",
    "max-lines-per-function": "off",
    "max-nested-callbacks": "error",
    "max-params": "error",
    "max-statements": "off",
    "max-statements-per-line": "error",
    "multiline-comment-style": [
      "error",
      "separate-lines"
    ],
    "multiline-ternary": "error",
    "new-cap": "error",
    "new-parens": "error",
    "newline-after-var": "off",
    "newline-before-return": "error",
    "newline-per-chained-call": "error",
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-async-promise-executor": "off",
    "no-await-in-loop": "error",
    "no-bitwise": "error",
    "no-buffer-constructor": "error",
    "no-caller": "error",
    "no-catch-shadow": "error",
    "no-confusing-arrow": "error",
    "no-console": ["error", { "allow": ["warn", "error"] }],
    "no-continue": "error",
    "no-div-regex": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-eq-null": "error",
    "no-eval": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-extra-label": "error",
    "no-extra-parens": "error",
    "no-floating-decimal": "error",
    "no-implicit-coercion": "error",
    "no-implicit-globals": "error",
    "no-implied-eval": "error",
    "no-inline-comments": "off",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-label-var": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-lonely-if": "error",
    "no-loop-func": "error",
    "no-magic-numbers": "off",
    "no-misleading-character-class": "off",
    "no-mixed-operators": "error",
    "no-mixed-requires": "error",
    "no-multi-assign": "off",
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": "error",
    "no-native-reassign": "error",
    "no-negated-condition": "off",
    "no-negated-in-lhs": "error",
    "no-nested-ternary": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-object": "error",
    "no-new-require": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-path-concat": "error",
    "no-plusplus": "off",
    "no-process-env": "off",
    "no-process-exit": "error",
    "no-proto": "error",
    "no-prototype-builtins": "error",
    "no-restricted-globals": "error",
    "no-restricted-imports": "error",
    "no-restricted-modules": "error",
    "no-restricted-properties": "error",
    "no-restricted-syntax": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-shadow": "off",
    "no-shadow-restricted-names": "error",
    "no-spaced-func": "error",
    "no-sync": "error",
    "no-tabs": "error",
    "no-template-curly-in-string": "error",
    "no-ternary": "off",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-undefined": "error",
    "no-underscore-dangle": "off",
    "no-unmodified-loop-condition": "error",
    "no-unneeded-ternary": "error",
    "no-unused-expressions": "error",
    "no-use-before-define": "error",
    "no-useless-call": "error",
    "no-useless-catch": "off",
    "no-useless-computed-key": "error",
    "no-useless-concat": "error",
    "no-useless-constructor": "error",
    "no-useless-rename": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "no-void": "error",
    "no-warning-comments": "off",
    "no-whitespace-before-property": "error",
    "no-with": "error",
    "nonblock-statement-body-position": "error",
    "object-curly-newline": "error",
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": "off",
    "object-shorthand": "error",
    "one-var": "off",
    "one-var-declaration-per-line": "error",
    "operator-assignment": [
      "error",
      "always"
    ],
    "operator-linebreak": "error",
    "padded-blocks": "off",
    "padding-line-between-statements": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-destructuring": "off",
    "prefer-numeric-literals": "error",
    "prefer-object-spread": "off",
    "prefer-promise-reject-errors": "error",
    "prefer-reflect": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed"],
    "quotes": [
      "error",
      "single"
    ],
    "radix": "error",
    "require-atomic-updates": "off",
    "require-await": "error",
    "require-jsdoc": "off",
    "require-unicode-regexp": "off",
    "rest-spread-spacing": "error",
    "semi": "off",
    "semi-spacing": ["error", {
      "before": false,
      "after": true
    }],
    "semi-style": [
      "error",
      "last"
    ],
    "sort-imports": "off",
    "sort-keys": "off",
    "sort-vars": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", "never"],
    "space-in-parens": [
      "error",
      "never"
    ],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": [
      "error",
      "always"
    ],
    "strict": [
      "error",
      "never"
    ],
    "switch-colon-spacing": "error",
    "symbol-description": "error",
    "template-curly-spacing": [
      "error",
      "never"
    ],
    "template-tag-spacing": "error",
    "unicode-bom": [
      "error",
      "never"
    ],
    "valid-jsdoc": "error",
    "vars-on-top": "error",
    "wrap-iife": "error",
    "wrap-regex": "error",
    "yield-star-spacing": "error",
    "yoda": [
      "error",
      "never"
    ]
  }
}

/*jslint unparam: true*/
module.exports = (function (adt) {
    "use strict";
    return adt
        .data("List", {Cons: 1, Nil: 0})
        .implements("map", {
            Cons: function(h, tail, f, t) {
                return t.Cons.from(f(h), tail.map(f));
            },
            Nil: function(f, t) {
                return t.Nil.from();
            }
        })
        .implements("foldRight", {
            Cons: function(x, xs, z, f, t) {
                return f(x, xs.foldRight(z, f));
            },
            Nil: function(z, f, t) {
                return z;
            }
        })
        .implements("foldLeft", {
            Cons: function(x, xs, z, f, t) {
                return xs.foldLeft(f(x, z), f); 
            },
            Nil: function(z, f, t) {
                return z;
            }
        })
        .static("fromArray", function(arr, t) {
            var list = t.Nil.from();
            for (var i = arr.length - 1; i >= 0; i--) {
                list = t.Cons.from(arr[i], list);
            }
            return list;
        })
        .static("toArray", function(list, t) {
            var val = t.List.destructure()
                .Cons(function(h, _) { return h; })
                .Nil(function() { return null; });

            var tail = t.List.destructure()
                .Cons(function(_, t) { return t; })
                .Nil(function() { return null; });

            var arr = []
            for (var i = 0, cell = list; cell.isCons; i++, cell = tail(cell)) {
                arr[i] = val(cell);
            }
            return arr;
        });
}(
    require("./algebraic")
));
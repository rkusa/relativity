import ID from "relativity/id";

module("ID");

function isDisjoint(idA, idB) {
  return idA.zip(idB).map(function(leaves) {
    return !(leaves[0] && leaves[1]);
  }).reduce(function(a, b) { return a && b })
}

test("build leaf ID", function() {
  var l = new ID(1);
  strictEqual(l.leaf(), 1);
  ok(l.isLeaf(), "is leaf");
  strictEqual(l.left(), undefined);  
});

test("build interior ID", function() {
  var l = new ID([1,0]);
  ok(!l.isLeaf(), "not isLeaf");
  strictEqual(l.leaf(), undefined);
  if (l.left() instanceof ID) {
    strictEqual(l.left().leaf(), 1);
  } else {
    ok(false, "left not an ID");
  }
});


test("splits into disjoint pieces", function() {
  var i, ids = [new ID(1)].concat(new ID(1).split());
  expect(ids.length);
  
  for (i=0; i<ids.length; i++) {
    var pieces = ids[i].split();
    ok(isDisjoint(pieces[0], pieces[1]), "not disjoint: " + pieces[0], + ", " + pieces[1]);
  }

});

test("disjointness tester works", function() {
  ok(!isDisjoint(new ID(1), new ID(1)));
  ok(isDisjoint(new ID(1), new ID(0)));
  ok(!isDisjoint(new ID([1,0]), new ID([[1,0],0])));
  ok(isDisjoint(new ID([1,0]), new ID([[0,0],0])));
});

test("normalization", function() {
  var cases = [
    {from: 0, to: 0},
    {from: 1, to: 1},
    {from: [0,1], to: [0,1]},
    {from: [0,0], to: 0},
    {from: [1,[0,0]], to: [1,0]},
    {from: [1,[1,1]], to: 1}
  ];
  for (var i=0; i<cases.length; i++) {
    deepEqual(new ID(cases[i].from).normalize().flatten(), cases[i].to);
  }
});

test("sum", function() {
  var cases = [
    {add: 0, to: 0, get: 0},
    {add: 1, to: 1, get: 1},
    {add: 0, to: 1, get: 1},
    {add: [1,0], to: [0, 1], get: 1},
    {add: [0,[0,[0,1]]], to: [[[1,0],0],0], get: [[[1,0],0],[0, [0,1]]]},
    {add: [1,[0,[0,1]]], to: [[[1,0],0],0], get: [1,[0, [0,1]]]},
    {add: [1,[0,[0,1]]], to: [1,[0,[1,0]]], get: [1,[0, 1]]}
  ];
  for (var i=0; i<cases.length; i++) {
    deepEqual(new ID(cases[i].add).sum(new ID(cases[i].to)).flatten(), cases[i].get);
  }
});

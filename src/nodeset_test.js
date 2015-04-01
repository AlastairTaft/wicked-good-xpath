/**
 * @license
 * Copyright 2014 Software Freedom Conservancy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Node set test.
 *
 * Copyright 2012 Google Inc. All Rights Reserved.
 * Author: evanrthomas@google.com (Evan Thomas)
 */

goog.require('goog.iter');
goog.require('goog.testing.jsunit');
goog.require('wgxpath.NodeSet');


var divs = {};
var nodeset;

function setUp() {
  nodeset = new wgxpath.NodeSet();
  var d = document.getElementsByTagName('div');
  for (var i = 0; i < d.length; i++) {
    divs[d[i].id] = d[i];
  }
}

function assertNodeSetHas(nodeset, l) {
  assertEquals(l.length, nodeset.getLength());

  var iter = nodeset.iterator();
  for (var i = 0; i < l.length; i++) {
    assertEquals(document.getElementById(l[i]), iter.next());
  }
  assertEquals(null, iter.next());
}

function testMerge() {
  var nodeset2 = new wgxpath.NodeSet();
  nodeset.add(divs[2]);
  nodeset.add(divs[3]);
  nodeset.add(divs[4]);
  nodeset.add(divs[5]);
  nodeset.add(divs[6]);

  nodeset2.add(divs[1]);
  nodeset2.add(divs[2]);
  nodeset2.add(divs[3]);
  nodeset2.add(divs[4]);

  nodeset2 = wgxpath.NodeSet.merge(nodeset, nodeset2);
  assertNodeSetHas(nodeset2, [1, 2, 3, 4, 5, 6]);
}

function testMergeReverse() {
  var nodeset2 = new wgxpath.NodeSet();
  nodeset.unshift(divs[6]);
  nodeset.unshift(divs[5]);
  nodeset.unshift(divs[4]);
  nodeset.unshift(divs[3]);
  nodeset.unshift(divs[2]);

  nodeset2.unshift(divs[4]);
  nodeset2.unshift(divs[3]);
  nodeset2.unshift(divs[2]);
  nodeset2.unshift(divs[1]);

  nodeset2 = wgxpath.NodeSet.merge(nodeset, nodeset2);
  assertNodeSetHas(nodeset2, [1, 2, 3, 4, 5, 6]);
}

function testAdd() {
  nodeset.add(divs[4]);
  assertNodeSetHas(nodeset, [4]);

  nodeset = new wgxpath.NodeSet();
  nodeset.add(divs[1]);
  nodeset.add(divs[2]);
  assertNodeSetHas(nodeset, [1, 2]);

  nodeset = new wgxpath.NodeSet();
  nodeset.add(divs[1]);
  nodeset.add(divs[2]);
  nodeset.add(divs[3]);
  assertNodeSetHas(nodeset, [1, 2, 3]);

  nodeset = new wgxpath.NodeSet();
  nodeset.add(divs[0]);
  nodeset.add(divs[1]);
  nodeset.add(divs[2]);
  nodeset.add(divs[3]);
  nodeset.add(divs[4]);
  nodeset.add(divs[5]);
  nodeset.add(divs[6]);
  nodeset.add(divs[11]);
  nodeset.add(divs[12]);
  nodeset.add(divs[21]);
  assertNodeSetHas(nodeset, [0, 1, 2, 3, 4, 5, 6, 11, 12, 21]);
}

function testUnshift() {
  nodeset.unshift(divs[4]);
  assertNodeSetHas(nodeset, [4]);

  nodeset = new wgxpath.NodeSet();
  nodeset.unshift(divs[2]);
  nodeset.unshift(divs[1]);
  assertNodeSetHas(nodeset, [1, 2]);

  nodeset = new wgxpath.NodeSet();
  nodeset.unshift(divs[3]);
  nodeset.unshift(divs[2]);
  nodeset.unshift(divs[1]);
  assertNodeSetHas(nodeset, [1, 2, 3]);

  nodeset = new wgxpath.NodeSet();
  nodeset.unshift(divs[21]);
  nodeset.unshift(divs[12]);
  nodeset.unshift(divs[11]);
  nodeset.unshift(divs[6]);
  nodeset.unshift(divs[5]);
  nodeset.unshift(divs[4]);
  nodeset.unshift(divs[3]);
  nodeset.unshift(divs[2]);
  nodeset.unshift(divs[1]);
  nodeset.unshift(divs[0]);
  assertNodeSetHas(nodeset, [0, 1, 2, 3, 4, 5, 6, 11, 12, 21]);
}

function testGetFirst() {
  nodeset.add(divs[0]);
  nodeset.add(divs[1]);
  nodeset.add(divs[2]);

  assertEquals(nodeset.getFirst(), divs[0]);
}

function testIterator() {
  nodeset.add(divs[0]);
  nodeset.add(divs[1]);
  nodeset.add(divs[2]);
  var iter = nodeset.iterator();
  var reverseIter = nodeset.iterator(true);
  assertEquals(iter.next(), divs[0]);
  assertEquals(iter.next(), divs[1]);
  assertEquals(iter.next(), divs[2]);
  assertEquals(iter.next(), null);

  assertEquals(reverseIter.next(), divs[2]);
  assertEquals(reverseIter.next(), divs[1]);
  assertEquals(reverseIter.next(), divs[0]);
  assertEquals(iter.next(), null);
}

function testIteratorRemove() {
  nodeset.add(divs[0]);
  nodeset.add(divs[1]);
  nodeset.add(divs[2]);
  nodeset.add(divs[3]);
  nodeset.add(divs[4]);

  var iter = nodeset.iterator();
  iter.next(); // returns 0
  iter.remove(); // deletes 0
  assertThrows(iter.remove);
  iter.next(); // returns 1
  iter.next(); // returns 2
  iter.remove(); // deletes 2
  iter.next(); // returns 3
  iter.next(); // returns 4
  iter.remove(); // deletes 4
  assertNodeSetHas(nodeset, [1, 3]);
}

function testGetLength() {
  assertEquals(nodeset.getLength(), 0);
  nodeset.add(divs[0]);
  assertEquals(nodeset.getLength(), 1);
  nodeset.add(divs[1]);
  assertEquals(nodeset.getLength(), 2);
  nodeset.add(divs[2]);
  assertEquals(nodeset.getLength(), 3);

  var iter = nodeset.iterator();
  iter.next();
  iter.remove();
  assertEquals(nodeset.getLength(), 2);
  iter.next();
  iter.remove();
  assertEquals(nodeset.getLength(), 1);
  iter.next();
  iter.remove();
  assertEquals(nodeset.getLength(), 0);
}

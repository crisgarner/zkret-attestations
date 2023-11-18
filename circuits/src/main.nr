use dep::std;

fn main(leaf : Field, index : Field, hashpath : [Field; 2], root : Field) {
    let merkle_root = std::merkle::compute_merkle_root(leaf, index, hashpath);
    assert(merkle_root == root);
}

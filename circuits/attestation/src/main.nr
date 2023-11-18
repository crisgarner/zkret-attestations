use dep::std;

fn main(leaf : Field, index : Field, hashpath : [Field; 40], root : Field) {
    let merkle_root = std::merkle::compute_merkle_root(leaf, index, hashpath);
    assert(merkle_root == root);
}

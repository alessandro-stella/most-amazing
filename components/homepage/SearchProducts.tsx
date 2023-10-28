export default function SearchProduct({
    name,
    category,
}: {
    name: string;
    category: string;
}) {
    return (
        <div>
            <div>PRODUCT NAME: {name}</div>
            <div>PRODUCT CATEGORY: {category}</div>
        </div>
    );
}

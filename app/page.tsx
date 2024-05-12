import Card from "@/components/Card";
import Header from "@/components/Header";
import { createClient } from "@/supabase/client";
import { notFound } from "next/navigation";

export const revalidate = 0;
export default async function Home() {

  const supabase = createClient();
  const { data: topproducts } = await supabase
    .from('sell-products')
    .select()
    .eq('Boost', 'TRUE')

  const { data: products, error } = await supabase
    .from('sell-products')
    .select()
    .order('created_at', { ascending: false })

  if (!products) {
    return notFound();
  }


  return (

    <main className="min-h-screen mx-auto max-w-[100rem] ">
      <Header />
      <div className="px-12 pt-12 pb-20">
        <div className="flex flex-col xl:flex-row gap-2 xl:gap-40">
          <div className="pt-12">
            <h2 className="text-4xl mb-16">OUR TOP PRODUCTS</h2>
            <p className="text-xl">Our top products which are trending</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-12">
            {topproducts ?
              topproducts.map((product) => (
                <Card key={`${product.name}-${product.id}`} {...product} imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${product.imageUrl}`} />
              )) :
              <p className="text-xl pt-12 text-gray-800">all top products are gone...</p>}
          </div>
        </div>
      </div>
      <div className="px-12 pt-1 pb-20">
        <div className="flex flex-col gap-4">
          <div className="pt-1">
            <h2 className="text-4xl mb-1">ALL PRODUCTS</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 xl:gap-12">
            {products.map((product) => (
              <Card key={`${product.name}-${product.id}`} {...product} imageUrl={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${product.imageUrl}`} />
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
